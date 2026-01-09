import type { BarikoiReverseGeocodeResponse } from "../lib/reverceLocation";
import type { SelectedLocation } from "./MapBox";

type Props = {
  selectedLocation: SelectedLocation;
  isLoading: boolean;
  address?: BarikoiReverseGeocodeResponse | null;
  onClose: () => void;
};
const SideBar = ({ selectedLocation, isLoading, address, onClose }: Props) => {
  console.log("sidebar", address);

  const handleCopy = async () => {
    try {
      // const textToCopy = `${address?.place.latitude}, ${address?.place.longitude}`;
      // await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl z-20
      transform transition-transform duration-300
      ${selectedLocation ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Location Info</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 pb-4 mt-0">
              {/* <div className="px-4 mt-8 flex align-middle">
                <div className="py-2">
                  <h1 className="text-2xl font-bold text-gray-800 select-text">
                    {address?.}
                  </h1>
                  <div className="flex items-center gap-2 py-2 text-sm">
                    <span className="bg-blue-100 text-gray-600 px-3 py-1 rounded-full">
                      {address?.type}
                    </span>
                  </div>
                </div>
              </div> */}

              <div className="px-4">
                <div className="p-2 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer relative rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 384 512"
                        className="text-red-500 text-xl"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                      </svg>
                      Address
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-800 text-[15px] leading-relaxed font-medium border-l-4 border-green-500 pl-3 py-1 bg-green-50/50 rounded-r-md">
                      {address?.place.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4">
                <div className="p-2 bg-white ">
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 512 512"
                      className="text-green-500 text-xl"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
                    </svg>
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg  transition-colors">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 576 512"
                          className="text-green-400"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
                        </svg>
                        <span className="text-sm font-medium">Sub Area</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {address?.place.area_components.sub_area}
                      </p>
                    </div>{" "}
                    <div className="p-2 bg-gray-50 rounded-lg  transition-colors">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 576 512"
                          className="text-green-400"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
                        </svg>
                        <span className="text-sm font-medium">Area</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {address?.place.area}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg  transition-colors">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 576 512"
                          className="text-green-400"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
                        </svg>
                        <span className="text-sm font-medium">Postcode</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {address?.place.postCode}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg  transition-colors">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 576 512"
                          className="text-green-400"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z" />
                        </svg>
                        <span className="text-sm font-medium">District</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {address?.place.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4" style={{ opacity: 1, transform: "none" }}>
                <div
                  className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-50 text-sm text-gray-600"
                  style={{ opacity: 1 }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 384 512"
                          className="text-blue-500 text-sm"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                        </svg>
                        <span className="font-medium">Location:</span>
                        {/* <span className="font-mono text-xs">
                          {address?.lat}, {address?.lon}
                        </span> */}
                        <span className="font-mono text-xs">
                          {/* {address?.place.latitude}, {address?.place.longitude} */}
                        </span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-blue-500 transition-transform active:scale-90"
                        title="Copy coordinates"
                        onClick={handleCopy}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 448 512"
                          className="w-3 h-3"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
