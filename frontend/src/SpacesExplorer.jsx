import React, { useMemo, useState } from "react";

// Spaces Explorer - Single-file React component (Tailwind CSS)
// Usage: Drop this file into a React app (Create React App / Next.js).
// Tailwind should be configured in the project for styling to work.

const MOCK_SPACES = [
  {
    id: 1,
    name: "Studio Loft - Downtown",
    location: "Mumbai",
    address: "Fort, Mumbai",
    amenities: ["WiFi", "Projector", "Whiteboard"],
    capacity: 20,
    price_hourly: 500,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Sunny Meeting Room",
    location: "Pune",
    address: "Koregaon Park, Pune",
    amenities: ["WiFi", "Coffee", "AC"],
    capacity: 8,
    price_hourly: 250,
    image:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1200&q=80",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Creative Hub - Large",
    location: "Bengaluru",
    address: "Koramangala, Bengaluru",
    amenities: ["WiFi", "Parking", "Projector", "AC"],
    capacity: 50,
    price_hourly: 1500,
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Quiet Corner",
    location: "Mumbai",
    address: "Andheri West, Mumbai",
    amenities: ["WiFi", "Whiteboard"],
    capacity: 4,
    price_hourly: 120,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    rating: 4.0,
  },
];

const ALL_AMENITIES = Array.from(
  new Set(MOCK_SPACES.flatMap((s) => s.amenities))
).sort();

export default function SpacesExplorer() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minCapacity, setMinCapacity] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceMax, setPriceMax] = useState(2000);

  // Filter logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SPACES.filter((s) => {
      if (location && s.location.toLowerCase() !== location.toLowerCase())
        return false;
      if (q && !(`${s.name} ${s.address} ${s.location}`.toLowerCase()).includes(q))
        return false;
      if (s.capacity < minCapacity) return false;
      if (s.price_hourly > priceMax) return false;
      for (const a of selectedAmenities) if (!s.amenities.includes(a)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price_hourly - b.price_hourly;
      if (sortBy === "price_desc") return b.price_hourly - a.price_hourly;
      if (sortBy === "rating") return b.rating - a.rating;
      // relevance default: simple proximity by name match
      if (q) {
        const aMatch = (`${a.name} ${a.address}`).toLowerCase().includes(q) ? 0 : 1;
        const bMatch = (`${b.name} ${b.address}`).toLowerCase().includes(q) ? 0 : 1;
        return aMatch - bMatch;
      }
      return b.rating - a.rating;
    });
  }, [query, location, selectedAmenities, minCapacity, sortBy, priceMax]);

  function toggleAmenity(a) {
    setSelectedAmenities((cur) =>
      cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Discover Spaces</h1>
        <p className="text-sm text-gray-600">Search by location, amenities, capacity & price</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <aside className="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Search name, address, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Any</option>
              {Array.from(new Set(MOCK_SPACES.map((s) => s.location))).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_AMENITIES.map((a) => (
                <label key={a} className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="mr-2"
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Min capacity: {minCapacity}</label>
            <input
              type="range"
              min={1}
              max={100}
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Max hourly price: ₹{priceMax}</label>
            <input
              type="range"
              min={50}
              max={2000}
              step={10}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setQuery("");
                setLocation("");
                setSelectedAmenities([]);
                setMinCapacity(1);
                setPriceMax(2000);
                setSortBy("relevance");
              }}
            >
              Reset
            </button>
            <button
              className="flex-1 px-3 py-2 border rounded"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Results area */}
        <main className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">{filtered.length} spaces found</div>
            <div className="flex items-center gap-3">
              <label className="text-sm">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((s) => (
              <article key={s.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="flex">
                  <img src={s.image} alt={s.name} className="w-40 h-32 object-cover" />
                  <div className="p-4 flex-1">
                    <h2 className="font-semibold text-lg">{s.name}</h2>
                    <div className="text-sm text-gray-500">{s.address} • {s.location}</div>
                    <div className="mt-2 text-sm">Capacity: <span className="font-medium">{s.capacity}</span></div>
                    <div className="mt-2 text-sm">Amenities: <span className="text-gray-700">{s.amenities.join(", ")}</span></div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">₹{s.price_hourly}/hr</div>
                        <div className="text-sm text-yellow-600">⭐ {s.rating}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border">View</button>
                        <button className="px-3 py-1 rounded bg-blue-600 text-white">Book</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-600 py-12">
                No spaces match your filters — try changing location or amenities.
              </div>
            )}
          </div>

          {/* Simple footer / pagination placeholder */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div>Showing {filtered.length} results</div>
            <div>
              <button className="px-3 py-1 rounded border mr-2">Prev</button>
              <button className="px-3 py-1 rounded border">Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
