// components/MapContainer.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Typography, Alert, Paper } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de markers en React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Posición por defecto (Loja, Ecuador)
const DEFAULT_POSITION = [-3.996719, -79.2017674];

// Componente para manejar los clicks en el mapa
function MapClickHandler({ onCoordinatesChange }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onCoordinatesChange(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div>
          <strong>Ubicación seleccionada</strong>
          <br />
          Lat: {position[0].toFixed(6)}
          <br />
          Lng: {position[1].toFixed(6)}
        </div>
      </Popup>
    </Marker>
  );
}

const MapView = ({ onCoordinatesChange, initialCoordinates = null }) => {
  const [map, setMap] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(initialCoordinates);

  useEffect(() => {
    if (initialCoordinates && initialCoordinates.lat && initialCoordinates.lng) {
      setSelectedPosition([initialCoordinates.lat, initialCoordinates.lng]);
    }
  }, [initialCoordinates]);

  const handleCoordinatesChange = (lat, lng) => {
    setSelectedPosition([lat, lng]);
    if (onCoordinatesChange) {
      onCoordinatesChange(lat, lng);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        🗺️ Seleccione su ubicación en el mapa
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Haga click en el mapa para seleccionar la ubicación de entrega
      </Alert>

      <Paper 
        elevation={3} 
        sx={{ 
          height: '300px', 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <MapContainer
          center={selectedPosition || DEFAULT_POSITION}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onCoordinatesChange={handleCoordinatesChange} />
          
          {/* Marker inicial si hay coordenadas */}
          {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>
                <div>
                  <strong>Ubicación seleccionada</strong>
                  <br />
                  Lat: {selectedPosition[0].toFixed(6)}
                  <br />
                  Lng: {selectedPosition[1].toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Paper>

      {/* Información de coordenadas seleccionadas */}
     {/* {selectedPosition && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            📍 Coordenadas seleccionadas:
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            Latitud: {selectedPosition[0].toFixed(6)}
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            Longitud: {selectedPosition[1].toFixed(6)}
          </Typography>
        </Box>
      )}

       {!selectedPosition && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            👆 Haga click en el mapa para seleccionar una ubicación
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};

export default MapView;