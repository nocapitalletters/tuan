import archive from "../data/archive.json";
import styles from "./page.module.css";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className={`archive-page ${styles.aboutPage}`}>
      <h1>About</h1>
      <div className={styles.aboutCopy}>
        {archive.about.map((block, i) => block.type === "h3" ? <h2 key={i}>{block.text}</h2> : <p key={i}>{block.text}</p>)}
        <h2>The Upallnights manifesto</h2>
        <ol className={styles.manifesto}>{archive.manifesto.map((item) => <li key={item}>{item}</li>)}</ol>
      </div>
      <img src={archive.aboutImage} alt="The Upallnights backstage" loading="lazy" />
    </div>
  );
}
