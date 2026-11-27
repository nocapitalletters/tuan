export function createMusicQueue(columns) {
  const queue = [];
  const cards = columns.map((column) => column.map((song) => {
    const startIndex = queue.length;
    if (song.url) queue.push({ title: song.title, url: song.url });
    for (const block of song.details) {
      if (block.type === "track") queue.push({ title: `${song.title} — ${block.label}`, url: block.url });
    }
    return { song, startIndex };
  }));
  return { queue, cards };
}
