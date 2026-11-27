import archive from "../data/archive.json";
import EmbeddedVideo from "../components/embedded-video";
import styles from "./page.module.css";

export const metadata = { title: "Video" };

export default function VideoPage() {
  return (
    <div className="archive-page">
      <h1>Videos</h1>
      <div className={styles.videos}>
        {archive.videos.map((video) => (
          <article className={styles.videoCard} key={video.url}>
            <h2>{video.title}</h2>
            <p>{video.location} {video.date}</p>
            <EmbeddedVideo title={video.title} url={video.url} />
          </article>
        ))}
      </div>
    </div>
  );
}
