import Map, {
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Marker,
  Popup,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Dhaka } from "../lib/constant";
import { useEffect, useRef, useState } from "react";
import { reverseGeocode, type ReverseGeocodeResponse } from "../lib/api";
import SearchBox from "./SearchBox";
import { getCountryFromIP } from "../lib/getCountryFromIP";
import SideBar from "./SideBar";
import { Link } from "wouter";

type Point = {
  longitude: number;
  latitude: number;
};

export type SelectedLocation = {
  id: number;
  lng: number;
  lat: number;
} | null;

const MapBox = () => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [point, setPoint] = useState<Point | null>(null);
  // const [address, setAddress] = useState<ReverseGeocodeResponse | null>(null);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const [sidebarData, setSidebarData] = useState<ReverseGeocodeResponse | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(null);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    getCountryFromIP().then((code) => {
      setCountryCode(code ?? "bd"); // fallback if needed
    });
  }, []);

  const handleSearchSelect = (lat: number, lng: number) => {
    setPoint({ latitude: lat, longitude: lng });

    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 800,
    });
  };

  const handleDoubleClick = async (e: MapLayerMouseEvent) => {
    const { lng, lat } = e.lngLat;

    setSelectedLocation({
      lng,
      lat,
      id: Date.now(),
    });

    setIsSidebarLoading(true);
    setSidebarData(null);

    try {
      const result = await reverseGeocode(lat, lng);
      setSidebarData(result);
    } finally {
      setIsSidebarLoading(false);
    }
  };

  const handleClick = async (e: MapLayerMouseEvent) => {
    setPoint(null);
    console.log(e.lngLat);
    // const { lng, lat } = e.lngLat;
    // const result = await reverseGeocode(lat, lng);
    // setAddress(result);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `${point?.latitude.toFixed(
        6
      )}, ${point?.longitude.toFixed(6)}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="w-screen h-screen m-auto relative overflow-hidden">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: Dhaka[0],
          latitude: Dhaka[1],
          zoom: 12,
        }}
        // style={{ width: 600, height: 400 }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        // onClick={() => setPoint(null)}
        doubleClickZoom={false}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setPoint({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
          });
        }}
      >
        <SearchBox onSelect={handleSearchSelect} countryCode={countryCode} />

        {/* sidebar */}
        <SideBar
          selectedLocation={selectedLocation}
          isLoading={isSidebarLoading}
          address={sidebarData}
          onClose={() => {
            setSelectedLocation(null);
            setIsSidebarLoading(false);
          }}
        />

        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            anchor="bottom"
          >
            <div className="text-2xl">📍</div>
          </Marker>
        )}

        {point && (
          <>
            <Marker longitude={point.longitude} latitude={point.latitude}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z"
                  fill="#FF3D00"
                />
              </svg>
            </Marker>

            <Popup
              longitude={point.longitude}
              latitude={point.latitude}
              closeButton={false}
              closeOnClick={false}
              anchor="top-left"
            >
              <div className="bg-white shadow-md w-60 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-2 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span>Location</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="text-xs bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded flex items-center gap-1"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 448 512"
                        height={10}
                        width={10}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z" />
                      </svg>
                      <span className="text-xs">
                        {" "}
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <code className="text-xs bg-black/20 px-1.5 py-0.5 rounded w-full overflow-x-auto whitespace-nowrap">
                      {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                    </code>
                  </div>
                </div>
                {/* <h4>Location</h4>
                <p>Lng: {point.longitude.toFixed(4)}</p>
                <p>Lat: {point.latitude.toFixed(4)}</p> */}

                {/* <button onClick={() => setPoint(null)}>Remove</button> */}
              </div>
            </Popup>
          </>
        )}

        {/* <YouAreHere /> */}
        <Link
          to="/csv"
          className="absolute top-4 right-4 inline-flex items-center justify-center
             bg-blue-600 text-white font-medium
             px-4 py-2 rounded-md
             hover:bg-blue-700
             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
             transition"
        >
          GO TO CSV File Viewer
        </Link>

        <GeolocateControl position="bottom-right" />
        <NavigationControl position="bottom-right" />
        <ScaleControl position="bottom-right" />
      </Map>
    </main>
  );
};

export default MapBox;
