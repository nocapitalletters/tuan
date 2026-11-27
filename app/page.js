import archive from "./data/archive.json";
import Music from "./_components/music";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.intro}>
        <div>
          <h1 className={styles.introLogo}><span className="sr-only">The Upallnights archive</span><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: archive.logo }} /><span className={styles.logoCaption} aria-hidden="true">archive</span></h1>
          <h2>b. April 3, 2006 d. June 18, 2011 <small>(zombie resurrection October 4, 2013)</small></h2>
          <p>They were a band that mattered to many. In true DIY-spirit they produced their own recordings and travelled many a road to perform their punk pop wonders to whoever was willing to lend them an ear. With a bit of help from friends around Europe, they planned and played shows in cities like Hamburg, Berlin, Cologne, Gent, Greifswald, Rostock, Dresden, Chemnitz, Frankfurt, Freiburg and more. Plenty of good old times.</p>
          <p>Click away to dive into the nostalgia.</p>
          <p>Keep listening to unlock verified fan diploma!</p>
        </div>
        <img src={archive.heroImage} width="600" height="450" alt="The Upallnights" />
      </section>
      <Music columns={archive.columns} />
    </>
  );
}
