"use client";

import { useId, useState } from "react";
import { useArchiveAudio } from "../components/audio-provider";
import EmbeddedVideo from "../components/embedded-video";
import { downloadUrl } from "../lib/download";
import { createMusicQueue } from "../lib/music-queue.mjs";
import styles from "./music.module.css";

function ActionIcon({ download = false }) {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path fill="currentColor" fillRule="evenodd" d={`M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z ${download ? "M6.5 3.5h3v4H12L8 12 4 7.5h2.5Z" : "M6 4v8l6-4Z"}`} />
    </svg>
  );
}

function Song({ song, queue, startIndex }) {
  const { playAt, current, playing } = useArchiveAudio();
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const mainPlaying = song.url && playing && current?.url === song.url;
  const titles = song.concert ? song.title.split(" — ") : [song.title];

  return (
    <article className={`${styles.songCard} ${song.alternate ? styles.songAlternate : ""} ${song.concert ? styles.concert : ""} ${song.imageRight ? styles.songImageRight : ""}`} style={song.background ? { backgroundImage: `linear-gradient(#0009, #0009), url("${song.background}")` } : undefined}>
      {song.image && <figure className={styles.songPhoto}><img src={song.image} alt="" loading="lazy" />{song.photoCredit && <figcaption>{song.photoCredit}</figcaption>}</figure>}
      <div className={styles.songHeading}>
        {titles.map((title, i) => {
          const match = title.match(/^(.*?)\s*\[\s*(.*?)\s*\]$/);
          return <h3 className={(song.longTitle || (song.concert && i === 1)) ? styles.longTitle : ""} key={title}>{match ? <>{match[1]} <span className={styles.songDuration}>[ {match[2]} ]</span></> : title}</h3>;
        })}
        <div className={styles.songActions}>
          <button className={mainPlaying ? styles.mainPlaying : undefined} type="button" onClick={() => playAt(queue, startIndex)}><ActionIcon /> {song.concert ? "Play show" : "Play song"}</button>
          {song.url && <a href={downloadUrl(song.url)}><ActionIcon download /> Download</a>}
        </div>
        <button className={styles.trackToggle} type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => setExpanded(!expanded)}>{expanded ? "Hide track info" : "Show track info"}</button>
      </div>
      <div id={detailsId} className={`${styles.trackInfo} ${expanded ? styles.isExpanded : ""}`} aria-hidden={!expanded} inert={!expanded}>
        <div className={styles.trackInfoInner}><div className={styles.trackContent}>
          {song.details.map((block, i) => {
            if (block.type === "heading") return <h4 key={i}>{block.text}</h4>;
            if (block.type === "credit") return <p className={styles.trackCredit} key={i}><strong>{block.label}</strong> {block.value}</p>;
            if (block.type === "paragraph") return block.contact
              ? <p key={i}>{block.text} <a href="mailto:stoffe.sundberg@gmail.com">stoffe.sundberg@gmail.com</a></p>
              : <p className={styles.trackParagraph} key={i}>{block.text}</p>;
            if (block.type === "video") return <div className={styles.trackVideo} key={i}><h4>{block.title}</h4><EmbeddedVideo title={block.title} url={block.url} /></div>;
            if (block.type === "download") return <p key={i}>{block.label} <a href={downloadUrl(block.url)}><ActionIcon download /> Download stems</a></p>;
            if (block.type === "track") {
              const trackIndex = startIndex + (song.url ? 1 : 0) + song.details.slice(0, i).filter((detail) => detail.type === "track").length;
              return <div className={styles.version} key={i}><span>{block.label}</span><button type="button" onClick={() => playAt(queue, trackIndex)} aria-label={`Play ${block.label}`}><ActionIcon /></button><a href={downloadUrl(block.url)} aria-label={`Download ${block.label}`}><ActionIcon download /></a></div>;
            }
            return null;
          })}
        </div></div>
      </div>
    </article>
  );
}

export default function Music({ columns }) {
  const { queue, cards } = createMusicQueue(columns);
  return (
    <section className={styles.musicSection} id="audio" aria-labelledby="music-title">
      <h2 id="music-title">Music</h2>
      <div className={styles.songColumns}>
        {cards.map((column, i) => <div key={i}>{column.map(({ song, startIndex }) => <Song song={song} queue={queue} startIndex={startIndex} key={song.title} />)}</div>)}
      </div>
    </section>
  );
}
