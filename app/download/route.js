import archive from "../data/archive.json";

const songs = archive.columns.flat();
const allowed = new Set([
  archive.fanDiplomaImage,
  ...songs.flatMap((song) => [song.url, ...song.details.filter((block) => block.type === "track" || block.type === "download").map((block) => block.url)]),
  ...archive.radio.flatMap((show) => show.tracks.map((track) => track.url)),
].filter(Boolean));

export async function GET(request) {
  const url = new URL(request.url).searchParams.get("file");
  if (!allowed.has(url)) return new Response("Recording not found.", { status: 404 });

  try {
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      console.error(`Media download failed: ${upstream.status} ${url}`);
      return new Response("The download is currently unavailable.", { status: 502 });
    }
    const filename = new URL(url).pathname.split("/").pop();
    const headers = {
      "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    };
    const length = upstream.headers.get("content-length");
    if (length) headers["Content-Length"] = length;
    return new Response(upstream.body, { headers });
  } catch (error) {
    console.error("Media download failed:", error);
    return new Response("The download is currently unavailable.", { status: 502 });
  }
}
