'use client'

import styles from "./index.module.css";
import { useState } from 'react';

export default function PlayButton() {
    const [isPlaying, setIsPlaying] = useState(false);
    
    function togglePlay() {
        let videoElement = document.getElementById('video');
        if (!videoElement.ended) {
            isPlaying ? videoElement.pause() : videoElement.play();
            setIsPlaying(!isPlaying);
        }
        
    }
    return (
        <button className={isPlaying ? `${styles.playButton} ${styles.isPaused}` : styles.playButton} onClick={togglePlay}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
    );
}