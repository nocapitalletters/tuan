import archive from "../data/archive.json";
import RadioShows from "./_components/radio-shows";

export const metadata = { title: "Radio" };

export default function RadioPage() {
  return <div className="archive-page"><h1>Radio</h1><RadioShows shows={archive.radio} /></div>;
}
