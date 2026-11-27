const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");
const archive = require("../app/data/archive.json");

let server;
let base;

before(async () => {
  const listener = net.createServer();
  await new Promise((resolve) => listener.listen(0, "127.0.0.1", resolve));
  const port = listener.address().port;
  await new Promise((resolve) => listener.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { stdio: "ignore" });
  let lastError;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error("Next.js server exited before becoming ready.");
    try {
      if ((await fetch(base)).ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next.js server did not start.", { cause: lastError });
});

after(() => server?.kill());

test("archive pages and navigation are available", async () => {
  for (const route of ["/", "/video", "/radio", "/about", "/final-gig"]) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /href="\/#audio"/);
    assert.match(html, /href="\/#top"/);
    assert.match(html, /<meta property="og:image" content="https:\/\/bricksdemo\.euwest01\.umbraco\.io\/media\/zboj1mjd\/dsc00961_600\.jpg"\/>/);
    assert.doesNotMatch(html, /<footer\b/);
    assert.doesNotMatch(html, /<audio\b[^>]*\bcontrols(?:=|\s|>)/);
  }
});

test("radio recordings offer playback without download links", async () => {
  const response = await fetch(base + "/radio");
  const html = await response.text();
  assert.match(html, /<button[^>]*>▶ Play /);
  assert.doesNotMatch(html, /href="\/download\?/);
  assert.doesNotMatch(html, /Next show/);
});

test("music autoplay follows each main recording, its versions and then the next card", async () => {
  const { createMusicQueue } = await import("../app/lib/music-queue.mjs");
  const columns = [[
    { title: "First", url: "first.mp3", details: [
      { type: "heading", text: "Other versions:" },
      { type: "track", label: "Live", url: "live.mp3" },
      { type: "track", label: "Demo", url: "demo.mp3" },
    ] },
    { title: "Second", url: "second.mp3", details: [] },
  ], [
    { title: "Concert", concert: true, details: [
      { type: "track", label: "First live", url: "live.mp3" },
      { type: "track", label: "Second live", url: "second-live.mp3" },
    ] },
    { title: "Last", url: "last.mp3", details: [] },
  ]];
  const { queue, cards } = createMusicQueue(columns);
  assert.deepEqual(queue.map((track) => track.url), ["first.mp3", "live.mp3", "demo.mp3", "second.mp3", "live.mp3", "second-live.mp3", "last.mp3"]);
  assert.deepEqual(cards.map((column) => column.map((card) => card.startIndex)), [[0, 3], [4, 6]]);
  assert.equal(queue[cards[1][0].startIndex].title, "Concert — First live");
});

test("download route rejects URLs outside the archive", async () => {
  const response = await fetch(`${base}/download?file=${encodeURIComponent("https://example.com/file.mp3")}`);
  assert.equal(response.status, 404);
});

test("download route streams an archive recording as an attachment", async () => {
  const url = archive.columns[0][0].url;
  const response = await fetch(`${base}/download?file=${encodeURIComponent(url)}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-disposition"), /^attachment; filename="[^"]+\.mp3"$/);
  assert.match(response.headers.get("content-type"), /^audio\//);
  await response.body.cancel();
});

test("download route serves the fan diploma as an image attachment", async () => {
  const response = await fetch(`${base}/download?file=${encodeURIComponent(archive.fanDiplomaImage)}`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-disposition"), 'attachment; filename="verified.jpg"');
  assert.match(response.headers.get("content-type"), /^image\/jpeg/);
  await response.body.cancel();
});
