import { Josefin_Sans } from "next/font/google";
import "./globals.css";

const josefinSans = Josefin_Sans({ subsets: ["latin"], variable: '--font-josefin', display: 'swap', });

export const metadata = {
  title: "The Upallnights' last gig",
  description: "A video recording of the last song performed at the funeral gig held by the band in 2011",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="https://lummo.euwest01.umbraco.io/media/oxdlosxe/anders.jpg"></meta>
      </head>
      <body className={josefinSans.variable}>{children}</body>
    </html>
  );
}
