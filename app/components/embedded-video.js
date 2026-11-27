import styles from "./embedded-video.module.css";

export default function EmbeddedVideo({ title, url }) {
  return <div className={styles.embed}><iframe src={url} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
}
