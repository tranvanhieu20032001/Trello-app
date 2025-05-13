import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import Loading from "../Loader/Loading";
import { uploadCoverImage_API, uploadFile_API } from "~/apis";
import { BE_URL } from "~/utils/constants";
import { useDispatch } from "react-redux";
import loading from "~/assets/loading.svg";
import { LiaTimesSolid } from "react-icons/lia";

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

const CoverBgCardModal = ({
  card,
  isOpen,
  fetchCard,
  onClose,
  position = "top-0 left-full",
}) => {
  const [cover, setCover] = useState("");
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [collectionId, setCollectionId] = useState(null);
  const fileInputRef = useRef(null);
  const ACCESS_KEY = import.meta.env.VITE_US_ACCESS_KEY;

  useEffect(() => {
    if (card?.cover && card.cover !== cover) {
      setCover(card.cover);
    }
  }, [card]);

  const fetchAllImages = async (type = "init") => {
    setIsLoading(true);
    setImages([]);

    try {
      let page = 1;
      let allResults = [];
      let hasMore = true;

      while (hasMore && page <= 5) {
        const params = { per_page: 15, page };
        const headers = { Authorization: `Client-ID ${ACCESS_KEY}` };
        let url = "";

        if (type === "search" && query) {
          url = "https://api.unsplash.com/search/photos";
          params.query = query;
        } else if (type === "collection" && collectionId) {
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
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchAllImages("init");
  }, []);

  useEffect(() => {
    if (collectionId) {
      fetchAllImages("collection");
    }
  }, [collectionId]);

  const handleSearch = () => {
    setCollectionId(null);
    fetchAllImages("search");
  };

  const handleSelectCollection = (id) => {
    setQuery("");
    setCollectionId(id);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoadingCover(true);
      const res = await uploadFile_API(formData);
      const { filePath } = res.data;
      const fullUrl = BE_URL + "/" + filePath;
      await uploadCoverImage_API(card?.id, fullUrl);
      setCover(fullUrl);
      setTimeout(() => setIsLoadingCover(false), 600);
      await fetchCard();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSetCoverBg = async (filePath) => {
    try {
      setIsLoadingCover(true);
      await uploadCoverImage_API(card?.id, filePath);
      setCover(filePath);
      setTimeout(() => setIsLoadingCover(false), 600);
      await fetchCard();
    } catch (error) {
      console.error("Set cover error:", error);
    }
  };

  const handleDeleteCover = async () => {
    try {
      await uploadCoverImage_API(card?.id, null);
      setCover(null);
      await fetchCard();
    } catch (err) {
      console.error("Delete cover error:", err);
    }
  };
  if (!isOpen) return;

  return (
    <div
      className={`absolute ${position} bg-white p-6 rounded-2xl border shadow-lg w-96 z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        <LiaTimesSolid size={20} className="cursor-pointer" />
      </button>

      {cover && (
        <div className="flex items-center justify-center w-full">
          <div className="relative">
            {isLoadingCover ? (
              <div className="h-24 w-40 flex items-center justify-center mb-4">
                <img
                  src={loading}
                  className="h-10 rounded-md object-cover cursor-pointer"
                  alt="Cover"
                />
              </div>
            ) : (
              <>
                <img
                  src={cover}
                  className="h-24 w-40 rounded-md object-cover cursor-pointer mb-4"
                  alt="Cover"
                />
                <button
                  className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  onClick={handleDeleteCover}
                >
                  <AiOutlineDelete size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <h2 className="text-xs font-medium">Attachment</h2>
      <button
        onClick={handleUploadClick}
        className="w-full py-1 px-2 bg-gray-200 rounded-sm hover:bg-gray-300 mb-4"
      >
        Upload a cover image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <h2 className="text-xs font-medium">Photos from Unsplash</h2>
      <div className="flex items-center gap-1 my-2">
        <input
          type="text"
          className="w-full py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 border border-gray-300 focus:border-blue-500 transition"
          placeholder="Search photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          <CiSearch size={20} />
        </button>
      </div>

      <h2 className="text-[10px]">Suggested searches</h2>
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

      <div className="grid grid-cols-3 gap-1 max-h-60 overflow-y-auto min-h-32 relative">
        {isLoading ? (
          <Loading />
        ) : (
          images.map((img) => {
            const isSelected = cover === img.urls.regular;
            return (
              <img
                key={img.id}
                src={img.urls.small}
                alt={img.alt_description}
                className={`w-full h-14 object-cover rounded-md cursor-pointer border-4 ${
                  isSelected ? "border-blue-500" : "border-transparent"
                } transition-transform duration-150`}
                onClick={() => handleSetCoverBg(img.urls.regular)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CoverBgCardModal;
