"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import archive from "../data/archive.json";
import { downloadUrl } from "../lib/download";
import styles from "./audio-provider.module.css";

const AudioContext = createContext(null);

export function useArchiveAudio() {
  return useContext(AudioContext);
}

export default function AudioProvider({ children }) {
  const audio = useRef(null);
  const queue = useRef([]);
  const index = useRef(0);
  const request = useRef(0);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  // Temporary development-only diploma preview; remove after review.
  const [completed, setCompleted] = useState(process.env.NODE_ENV === "development" ? 21 : 0);
  const [diplomaRequested, setDiplomaRequested] = useState(false);
  const [error, setError] = useState("");

  const play = useCallback(() => {
    const requestId = ++request.current;
    setError("");
    audio.current.play().catch(() => {
      if (request.current === requestId) setError("Playback could not start. Please try again.");
    });
  }, []);

  const playAt = useCallback((tracks, position) => {
    const track = tracks[position];
    if (!track?.url) {
      setError("This recording is unavailable.");
      return;
    }
    queue.current = tracks;
    index.current = position;
    setCurrent(track);
    setPlaying(false);
    audio.current.src = track.url;
    play();
  }, [play]);

  function onEnded() {
    setPlaying(false);
    const next = index.current + 1;
    if (next < queue.current.length) {
      setCompleted((count) => count + 1);
      playAt(queue.current, next);
    }
  }

  function pause() {
    request.current += 1;
    audio.current.pause();
    setPlaying(false);
  }

  function stop() {
    pause();
    audio.current.removeAttribute("src");
    audio.current.load();
    setCurrent(null);
    setError("");
    queue.current = [];
  }

  const levels = [
    ["Modest fan", 0],
    ["Half way fan!", 6],
    ["Real fan!", 9],
    ["Super fan!", 13],
    ["Hardcore fan!", 17],
    ["Verified fan diploma unlocked!", 21],
  ];

  return (
    <AudioContext.Provider value={{ playAt, current, playing, pause }}>
      {children}
      <aside className={`${styles.player} ${current || error ? styles.playerVisible : ""}`} aria-label="Audio player">
        {current && !diplomaRequested && (
          <div className={styles.fanMeter} aria-label="Fan-o-meter">
            <strong>Fan-o-meter! Your fan status:</strong>
            {levels.map(([label, threshold], i) => (
              <span key={label} aria-label={`${label} ${completed >= threshold ? "achieved" : "not yet achieved"}`} className={`${styles.fanLevel} ${styles[`level${i}`]} ${completed >= threshold ? styles.achieved : ""}`}>{label}</span>
            ))}
          </div>
        )}
        {current && <div className={styles.nowPlaying}>
          <span>Now playing: <strong>{current.title}</strong></span>
          {completed >= 21 && <a className={styles.diplomaDownload} hidden={diplomaRequested} href={downloadUrl(archive.fanDiplomaImage)} onClick={() => setDiplomaRequested(true)}>Download diploma</a>}
          <div className={styles.controls} role="group" aria-label="Playback controls">
            <button type="button" onClick={play} disabled={playing}>Play</button>
            <button type="button" onClick={pause} disabled={!playing}>Pause</button>
            <button type="button" onClick={stop}>Stop</button>
          </div>
        </div>}
        <audio ref={audio} hidden preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={onEnded} onError={() => {
          if (audio.current?.getAttribute("src")) setError("The recording could not be loaded.");
        }} aria-label="Current recording" />
        {error && <p role="alert">{error}</p>}
      </aside>
    </AudioContext.Provider>
  );
}
