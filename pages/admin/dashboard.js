export default function AdminDashboard(){
  return (
    <div className="container-w px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-4 text-gray-300">This is a starter admin area — you can add features: theme editor, listings CRUD, uploads.</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-800 p-6 rounded">
          <h3 className="font-semibold">Add Listing</h3>
          <p className="text-sm mt-2 text-gray-400">Use the API POST /api/listings to add items.</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded">
          <h3 className="font-semibold">Site Settings</h3>
          <p className="text-sm mt-2 text-gray-400">Theme color and branding can be added here.</p>
        </div>
      </div>
    </div>
  )
}
