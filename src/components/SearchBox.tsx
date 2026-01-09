import React, { useEffect, useRef, useState } from "react";
import { searchPlaces2, type BarikoiPlace } from "../lib/api";

type Props = {
  countryCode?: string | null;
  onSelect: (lat: number, lng: number) => void;
};

const SearchBox = ({ onSelect, countryCode }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BarikoiPlace[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [bkoiResults, setBkoiResults] = useState<BarikoiPlace[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      const results = await searchPlaces2(query, countryCode ?? undefined);
      console.log("bkoi results", results);
      setBkoiResults(results.slice(0, 5));
      // setResults(await searchPlaces(query, countryCode ?? undefined));
      setResults(results.slice(0, 5));
    }, 300);

    return () => clearTimeout(t);
  }, [query, countryCode]);

  console.log("bkoi results", bkoiResults);

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

  const handleSelect = (r: BarikoiPlace) => {
    setQuery(r.address);
    setResults([]);
    // onSelect(parseFloat(r.latitude), parseFloat(r.lon), r.display_name);
    // onSelect(parseFloat(r.latitude), parseFloat(r.longitude));
    onSelect(Number(r.latitude), Number(r.longitude));
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
                key={`${r.latitude}-${r.longitude}`}
                onClick={() => handleSelect(r)}
                className={`group flex flex-col py-2 px-3 cursor-pointer transition-colors duration-150
                  ${i === activeIndex ? "bg-gray-100" : ""}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 w-full">
                      <div className="w-4 m-auto shrink-0">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 384 512"
                          className="text-gray-400"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 whitespace-normal  w-full">
                        {r.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 ml-4">
                  <span className="px-2 py-0.5 text-xs bg-[#e0feed] text-gray-800 rounded-full flex items-center gap-1">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 576 512"
                      height={12}
                      width={12}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
                    </svg>
                    {r.pType}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height={12}
                      width={12}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 19h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4.5" />
                      <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
                      <path d="M19 18v.01" />
                      <path d="M3 7l9 6l9 -6" />
                    </svg>
                    {r.postCode}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
