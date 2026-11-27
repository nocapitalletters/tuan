"use client";

import { useEffect, useRef, useState } from "react";
import GigHeader from "./gig-header";
import styles from "./final-gig.module.css";
import { useArchiveAudio } from "../../components/audio-provider";

export default function FinalGig() {
  const video = useRef(null);
  const timer = useRef(null);
  const audio = useArchiveAudio();
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const shown = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (audio.playing) video.current?.pause();
  }, [audio.playing]);

  function play() {
    setError("");
    video.current.play().catch((reason) => {
      if (reason.name !== "AbortError") {
        setPlaying(false);
        setError("Video playback could not start.");
      }
    });
  }

  function replay() {
    shown.current = false;
    setEnded(false);
    video.current.currentTime = 0;
    play();
  }

  function onPlay() {
    audio.pause();
    setPlaying(true);
    if (!shown.current) {
      shown.current = true;
      setShowPopup(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShowPopup(false), 8500);
    }
  }

  return (
    <section className={styles.finalGig}>
      <GigHeader />
      <div className={styles.videoArea}>
        <video ref={video} className={styles.video} preload="none" onPlay={onPlay} onPause={() => setPlaying(false)} onEnded={() => { setEnded(true); setPlaying(false); setShowPopup(false); }} onError={() => { setPlaying(false); setShowPopup(false); setError("The video could not be loaded."); }}>
          <source src="https://bricksdemo.euwest01.umbraco.io/media/h23a42gz/720.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        {!ended && <button className={`${styles.playButton} ${playing ? styles.pauseButton : ""}`} type="button" onClick={() => playing ? video.current.pause() : play()}>{playing ? "Pause" : "Play"}</button>}
        {ended && <div className={styles.navigate}>
          <button type="button" onClick={replay}>Play again</button>
          <a href="https://www.youtube.com/watch?v=xu8GIL5mxAM" target="_blank" rel="noreferrer">Watch on YouTube</a>
          <a href="https://www.facebook.com/theupallnights" target="_blank" rel="noreferrer">Say hello</a>
        </div>}
        {showPopup && <p className={styles.popup}>Video is playing. Turn your sound on.</p>}
        {error && <p className={styles.error} role="alert">{error} <a href="https://www.youtube.com/watch?v=xu8GIL5mxAM" target="_blank" rel="noreferrer">Watch on YouTube</a></p>}
      </div>
    </section>
  );
}
