import Link from "next/link";
import { Josefin_Sans, Abel, Roboto, Slabo_27px } from "next/font/google";
import AudioProvider from "./components/audio-provider";
import "./globals.css";
import styles from "./layout.module.css";

const josefin = Josefin_Sans({ subsets: ["latin"], variable: "--font-josefin", display: "swap" });
const abel = Abel({ weight: "400", subsets: ["latin"], variable: "--font-abel", display: "swap" });
const roboto = Roboto({ weight: "500", subsets: ["latin"], variable: "--font-roboto", display: "swap" });
const slabo = Slabo_27px({ weight: "400", subsets: ["latin"], variable: "--font-slabo", display: "swap" });

export const metadata = {
  title: { default: "The Upallnights archive", template: "%s | The Upallnights" },
  description: "Music, videos and memories from The Upallnights.",
  openGraph: {
    images: ["https://bricksdemo.euwest01.umbraco.io/media/zboj1mjd/dsc00961_600.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${josefin.variable} ${abel.variable} ${roboto.variable} ${slabo.variable}`}>
      <body>
        <AudioProvider>
          <header className={styles.siteHeader} id="top">
            <Link href="/#top" className={styles.siteBrand}>The Upallnights <span>archive</span></Link>
            <nav aria-label="Main navigation">
              <Link href="/#top">Home</Link>
              <Link href="/#audio">Music</Link>
              <Link href="/video">Video</Link>
              <Link href="/radio">Radio</Link>
              <Link href="/about">About</Link>
              <Link href="/final-gig">The final gig</Link>
            </nav>
          </header>
          <main>{children}</main>
        </AudioProvider>
      </body>
    </html>
  );
}
