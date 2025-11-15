import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';
import api from './api/api'
import { useEffect, useState } from 'react';

interface IPosition {
    lat: number;
    lng: number;
  }

function App() {
  const defaultCenterPosition = { lat: 47.195832, lng: 18.164410}
  const [positions, setPositions] = useState<IPosition[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await api.Photos.getPhotos();
        const photos = response.data;

        const newPositions = photos.map(photo => ({
          lat: photo.location.lat,
          lng: photo.location.lng,
        }));

        setPositions(newPositions);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }
    fetchLocations();
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <div className="h-screen">
        <Map 
          defaultCenter={defaultCenterPosition} 
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
        >
          {positions.map((pos, index) => (
            <AdvancedMarker key={index} position={pos}></AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  )
}

export default App