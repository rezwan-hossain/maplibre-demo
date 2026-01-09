import React, { useEffect, useRef, useState } from "react";
import { searchPlaces, type SearchResult } from "../lib/api";

type Props = {
  countryCode?: string | null;
  onSelect: (lat: number, lng: number, label: string) => void;
};

const SearchBox = ({ onSelect, countryCode }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      setResults(await searchPlaces(query, countryCode ?? undefined));
    }, 300);

    return () => clearTimeout(t);
  }, [query, countryCode]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (r: SearchResult) => {
    setQuery(r.display_name);
    setResults([]);
    onSelect(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    if (e.key === "ArrowDown")
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));

    if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));

    if (e.key === "Enter" && activeIndex >= 0)
      handleSelect(results[activeIndex]);

    if (e.key === "Escape") setResults([]);
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-96"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center px-4 py-2">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.1-4.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location..."
            className="w-full outline-none text-sm"
          />
        </div>

        {results.length > 0 && (
          <ul className="border-t max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <li
                key={`${r.lat}-${r.lon}`}
                onClick={() => handleSelect(r)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100
                  ${i === activeIndex ? "bg-gray-100" : ""}`}
              >
                {r.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
