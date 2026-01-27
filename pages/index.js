// pages/index.js
import HeroSection from '../components/HeroSection'
import SearchBar from '../components/SearchBar'
import ListingCard from '../components/ListingCard'
import dbConnect from '../lib/db'
import Listing from '../models/Listing'

export default function Home({ listings = [] }) {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <section className="container-w px-6 py-8">
        <h2 className="text-3xl mb-4">Escorts in Bangalore, Karnataka, India</h2>
        <p className="mb-6 text-gray-300">Example listings — data comes from DB.</p>
        <div className="grid grid-cols-1 gap-6">
          {listings.length ? listings.map((l) => <ListingCard key={l._id} item={l} />) : <div className="text-gray-400">No listings yet. Admin can add via API.</div>}
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    // fetch published listings (limit for performance)
    const docs = await Listing.find({ published: true }).sort({ createdAt: -1 }).limit(20).lean();
    const listings = JSON.parse(JSON.stringify(docs)); // safe serialization
    return { props: { listings } }
  } catch (err) {
    console.error("getServerSideProps error:", err);
    // fail gracefully: render empty list, don't crash the entire page
    return { props: { listings: [] } }
  }
}
