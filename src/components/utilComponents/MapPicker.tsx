// src/components/MapPicker.tsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface MapPickerProps {
  location: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number }) => void;
  disabled?: boolean; // เพิ่มตรงนี้
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

const centerDefault = {
  lat: 13.736717,
  lng: 100.523186,
};

const MapPicker: React.FC<MapPickerProps> = ({ location, onChange, disabled }) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
    throw new Error('Missing Google Maps API key! Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env');
    }

    const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    });

  const [markerPosition, setMarkerPosition] = useState(location || centerDefault);

  useEffect(() => {
    if (location) setMarkerPosition(location);
  }, [location]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      onChange({ lat, lng });
    }
  };

  if (loadError) {
    return <div>โหลดแผนที่ล้มเหลว</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition}
      zoom={13}
      onClick={onMapClick}
    >
      <Marker position={markerPosition} draggable={true} onDragEnd={onMapClick} />
    </GoogleMap>
  ) : (
    <div>กำลังโหลดแผนที่...</div>
  );
};

export default MapPicker;
