'use client'

import styles from "./index.module.css";
import { useState } from 'react';

export default function Video() {
    const [isEnded, setIsEnded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupHasBeenShown, setPopupHasBeenShown] = useState(false);

    const showLinks = () => { 
        setIsEnded(true);
    };

    const replay = () => {
        setPopupHasBeenShown(false);
        setIsEnded(false);
        let videoElement = document.getElementById('video');
        videoElement.currentTime = 0;
        videoElement.play();
    };

    const popup = () => {
        if (!popupHasBeenShown) {
            setShowPopup(true);
            setPopupHasBeenShown(true);
            setTimeout(() => { 
                setShowPopup(false) 
            }, 8500);
        }
    };

    return (
        <>
            <video onPlay={popup} onEnded={showLinks} id="video" className={styles.video} preload="none" >
                <source src="https://sistavarvet.euwest01.umbraco.io/media/uqff0dyk/720.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            {isEnded && 
                <div className={styles.navigate}>
                    <ul>
                        <li onClick={replay}>Play again</li>
                        <li><a href="https://www.youtube.com/watch?v=xu8GIL5mxAM" target="_blank">Watch on YouTube</a></li>
                        <li><a href="https://www.facebook.com/theupallnights" target="_blank">Say hello</a></li>
                    </ul>
                </div>
            }
            {showPopup && 
                <div className={styles.popup}>Video is playing. Turn your sound on.</div>
            }
        </>
    );
}