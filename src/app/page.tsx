import { Hero } from "@/components/sections/Hero/Hero";
import { About } from "@/components/sections/About/About";
import { Work } from "@/components/sections/Work/Work";
import { about } from "@/content/about";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About moreLabel={about.moreLink} />
      <Work />
    </main>
  );
}
