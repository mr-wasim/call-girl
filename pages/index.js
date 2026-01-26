import HeroSection from '../components/HeroSection'
import SearchBar from '../components/SearchBar'
import ListingCard from '../components/ListingCard'

export default function Home({ listings=[] }) {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <section className="container-w px-6 py-8">
        <h2 className="text-3xl mb-4">Escorts in Bangalore, Karnataka, India</h2>
        <p className="mb-6 text-gray-300">Example listings — data comes from API.</p>
        <div className="grid grid-cols-1 gap-6">
          {listings.length ? listings.map((l) => <ListingCard key={l._id} item={l} />) : <div className="text-gray-400">No listings yet. Admin can add via API.</div>}
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps(){
  // fetch listings from internal API
  const res = await fetch('http://localhost:3000/api/listings')
  let listings = []
  try {
    listings = await res.json()
  } catch (e) {}
  return { props: { listings } }
}
