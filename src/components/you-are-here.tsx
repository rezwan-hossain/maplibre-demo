import React, { useEffect, useState } from "react";
import { Dhaka } from "../lib/constant";
import { Popup, useMap } from "react-map-gl/maplibre";
import { getLocation } from "../lib/api";

const YouAreHere = () => {
  const [popupLocation, setPopupLocation] = useState(Dhaka);

  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location = await getLocation();
      if (location !== Dhaka) {
        setPopupLocation(location);
        map.flyTo({ center: location, zoom: 12 });
      }
    })();
  }, [map]);

  return (
    <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
};

export default YouAreHere;
