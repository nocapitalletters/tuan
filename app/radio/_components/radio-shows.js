"use client";

import { useArchiveAudio } from "../../components/audio-provider";
import styles from "./radio-shows.module.css";

export default function RadioShows({ shows }) {
  const { playAt } = useArchiveAudio();
  return shows.map((show, i) => (
    <section className={`${styles.radioShow} ${i === 1 ? styles.reversed : ""}`} id={show.id} key={show.id}>
      <div>
        <h2>{show.title}</h2>
        <ol className={styles.radioTracks}>
          {show.tracks.map((track, index) => (
            <li key={track.url}>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <button type="button" onClick={() => playAt(show.tracks, index)}>▶ Play {track.title}</button>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.radioPhotos}>
        {show.photos.map((photo, index) => <figure key={photo}><img src={photo} alt="" loading="lazy" />{show.bylines[index] && <figcaption>{show.bylines[index]}</figcaption>}</figure>)}
      </div>
    </section>
  ));
}
