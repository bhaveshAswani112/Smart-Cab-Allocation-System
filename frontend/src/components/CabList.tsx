import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { getCabs } from '@/services/cabService';



const defaultCenter = {
  lat: 22.54992, 
  lng: 88.3392   
};

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

type Poi = { key: string, location: google.maps.LatLngLiteral };

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
        >
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};

const CabMap = () => {
  const [cabLocations, setCabLocations] = useState<Poi[]>([]);
  console.log(googleApiKey)
  useEffect(() => {
    const fetchCabLocations = async () => {
      try {
        const response = await getCabs();
        const cabs = response.data.cabs;
        const pois: Poi[] = cabs.map((cab: any) => ({
          key: cab.cabId,
          location: {
            lat: cab.location.coordinates[1],
            lng: cab.location.coordinates[0]
          }
        }));
        setCabLocations(pois);
      } catch (error) {
        console.error('Error fetching cab locations:', error);
      }
    };

    fetchCabLocations();
  }, []);
  
  return (
    <APIProvider apiKey={googleApiKey}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={defaultCenter}
        defaultZoom={10} 
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={"1"}
      >
        <PoiMarkers pois={cabLocations} />
      </Map>
    </APIProvider>
  );
};

export default CabMap;
