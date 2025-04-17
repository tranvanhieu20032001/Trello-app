import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loader/Loading";
import { AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

const collections = [
  { id: "1424240", name: "Animals" },
  { id: "9862224", name: "Cars" },
  { id: "2254180", name: "Colorful" },
  { id: "4332580", name: "Space" },
  { id: "317099", name: "Nature" },
  { id: "1521781", name: "Plants" },
  { id: "3348849", name: "Technology" },
  { id: "1580860", name: "Minimal" },
  { id: "434161", name: "Flatlays" },
];

const ImageUnSplash = () => {
  const [images, setImages] = useState([]);
  const [coverBg, setCoverBg] = useState(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collectionId, setCollectionId] = useState(null);
  const ACCESS_KEY = import.meta.env.VITE_US_ACCESS_KEY;

  const fetchAllImages = async () => {
    try {
      setIsLoading(true);
      let page = 1;
      let allResults = [];
      let hasMore = true;

      while (hasMore && page <= 5) {
        let url = "";
        let params = { per_page: 15, page };
        let headers = { Authorization: `Client-ID ${ACCESS_KEY}` };

        if (query) {
          url = "https://api.unsplash.com/search/photos";
          params.query = query;
        } else if (collectionId) {
          url = `https://api.unsplash.com/collections/${collectionId}/photos`;
        } else {
          url = "https://api.unsplash.com/photos";
        }

        const res = await axios.get(url, { headers, params });
        const result = res.data.results || res.data;

        if (Array.isArray(result) && result.length > 0) {
          allResults = [...allResults, ...result];
          page++;
        } else {
          hasMore = false;
        }
      }

      setImages(allResults);
      setTimeout(()=>setIsLoading(false), 600)
    } catch (err) {
      console.error("Error fetching images:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, [query, collectionId]);

  const handleSelectCollection = (id) => {
    setQuery("");
    setCollectionId(id);
  };

  const handleSearch = () => {
    setCollectionId(null);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 pt-[10vh] overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xs relative">
        <div className="flex items-center justify-center">
          <div className="relative">
            <img
              src={
                coverBg ||
                "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80"
              }
              className="h-24 w-40 rounded-md object-cover cursor-pointer mb-4"
              alt="Cover"
            />
            <button className="absolute top-1 right-1 p-1 rounded-full bg-gray-200">
              <AiOutlineDelete size={15} />
            </button>
          </div>
        </div>

        <h1 className="text-xs font-medium mb-2">Photos from Unsplash</h1>

        {/* Search Bar */}
        <div className="flex items-center gap-1 mb-4">
          <input
            type="text"
            className="w-full py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 border border-gray-300 focus:border-blue-500 transition"
            placeholder="Search photos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            <CiSearch size={20} />
          </button>
        </div>

        {/* Collections */}
        <div className="flex flex-wrap gap-2 mb-4">
          {collections.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectCollection(c.id)}
              className={`px-2 py-1 rounded-md text-[10px] cursor-pointer ${
                collectionId === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {c.name}
            </div>
          ))}
        </div>

        {/* Scrollable image grid */}
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 relative min-h-32">
          {isLoading ? (
            <Loading />
          ) : (
            images.map((img) => (
              <img
                key={img.id}
                src={img.urls.small}
                alt={img.alt_description}
                className="w-full h-12 object-cover rounded-md cursor-pointer"
                onClick={() => {
                  setCoverBg(img.urls.full);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUnSplash;
