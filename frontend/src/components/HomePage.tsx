import Hero from "./Hero";
import FeaturedCarousel from "./FeaturedCarousel";
import Categories from "./Categories";
import OffersCarousel from "./OffersCarousel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OffersCarousel />
      <Categories />
      <FeaturedCarousel />
    </>
  );
}
