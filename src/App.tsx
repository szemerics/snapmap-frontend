import {APIProvider, Map} from '@vis.gl/react-google-maps';

function App() {

  const position = { lat: 47.195832, lng: 18.164410}

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <div className="h-screen">
        <Map defaultCenter={position} defaultZoom={14}>

        </Map>
      </div>
    </APIProvider>
  )
}

export default App