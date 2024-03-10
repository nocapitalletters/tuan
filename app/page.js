import styles from "./page.module.css";
import PlayButton from "./components/play-button";
import Video from "./components/video";
import Header from "./components/header";

export default function Home() {
  return (
    <section className={styles.main_section}>
      <Header />
      <PlayButton />
      <Video />
    </section>
    );
}
