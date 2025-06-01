// MapPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MapZone from './components/MapZone'; // Adjust the import path as necessary
import countries from './constants/countries'; // You must adapt countries to use { lat, lng } points
import { get_country_mappings, get_all_teams } from './api/apis'; // Adjust the import path as necessary
import { FaSyncAlt } from 'react-icons/fa'; // Import refresh icon

type Zone = {
  name: string;
  points: { lat: number; lng: number }[];
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 0,
  lng: 0,
};

const mapOptions: google.maps.MapOptions = {
  mapTypeId: 'satellite',
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 180,
    },
    strictBounds: false, // allow vertical panning

  },
  minZoom: 1, // prevent wrap at zoom 0
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'greedy', // optional: for smoother pan

};

const MapPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [countriesData, setCountriesData] = useState<any[]>([]);
  const [teamsData, setTeamsData] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const formattedZones = countries.map((country: { name: any; points: { latitude: number; longitude: number; }[]; }) => ({
        name: country.name,
        points: country.points.map((pt: { latitude: number; longitude: number }) => ({
          lat: pt.latitude,
          lng: pt.longitude,
        })),
      }));
      setZones(formattedZones);

      const countriesResult = await get_country_mappings();
      const teamsResult = await get_all_teams();

      setCountriesData(countriesResult);
      setTeamsData(teamsResult);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTeamColor = (countryName: string): string => {
    try {
      const country = countriesData.find((c) => c.name === countryName);
      const team = country
        ? teamsData.find((t) => t.number === country.teamNo)
        : null;
      return team ? team.color : '#000000';
    } catch (error) {
      return '#000000';
    }
  };

  const handleUpdateCountry = (updatedCountry: any) => {

    setCountriesData(prevCountries => {
      const existingIndex = prevCountries.findIndex(c => c.name === updatedCountry.name);

      if (existingIndex !== -1) {
        const updatedCountries = [...prevCountries];
        updatedCountries[existingIndex] = {
          ...updatedCountries[existingIndex],
          teamNo: updatedCountry.teamNo,
          locked: updatedCountry.locked ?? updatedCountries[existingIndex].locked,
        };
        return updatedCountries;
      } else {
        return [...prevCountries];
      }
    });
  };

  window.electron.on("updateCountry", (country: any) => {
    handleUpdateCountry(country);
  });

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        {/* Refresh button */}
        <button
          onClick={fetchData}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: '50%',
            border: 'none',
            padding: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
          title="Refresh"
        >
          <FaSyncAlt size={20} color="black" />
        </button>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={3}
          options={mapOptions}
        >
          {isLoading ? (
            <div style={{ color: 'white', position: 'absolute', top: '50%', left: '50%' }}>
              Loading...
            </div>
          ) : (
            zones.map((zone) => (
              <MapZone
                key={zone.name}
                points={zone.points}
                color={getTeamColor(zone.name)}
                label={zone.name}
                onMarkerPress={() => { }}
              />
            ))
          )}
        </GoogleMap>

        {error && <div style={{ color: 'red', position: 'absolute', top: 10, left: 60 }}>{error}</div>}
      </div>
    </LoadScript>
  );
};

export default MapPage;
