import FilterBar from "../components/TopSection";
import ListingSection from "../components/Listings";

export default function Home() {
  return (
    <div className="container-w px-4 py-6">
      <FilterBar />
      <ListingSection />
    </div>
  )
}
