import Link from 'next/link'

export default function ListingCard({ item }) {
  return (
    <div className="bg-zinc-800 p-4 rounded flex space-x-4">
      
      <img
        src={item?.images?.[0] || '/placeholder.png'}
        alt={item?.title || 'listing'}
        className="w-36 h-36 object-cover rounded"
      />

      <div className="flex-1">
        <h4 className="text-xl font-bold">
          {item?.title || 'Unknown'}
        </h4>

        <p className="text-sm mt-2">
          {item?.excerpt || 'No description yet.'}
        </p>

        <div className="mt-4 flex items-center space-x-2">
          <Link
            href={`/profile/${item?._id || '1'}`}
            className="px-3 py-2 bg-brand text-black rounded inline-block"
          >
            See more & contact
          </Link>
        </div>
      </div>

    </div>
  )
}
