// components/MapContainer.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Box, Typography, Alert, Paper } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los iconos de markers en React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Posición por defecto (Loja, Ecuador)
const DEFAULT_POSITION = [-3.996719, -79.2017674];

// Componente para manejar los clicks en el mapa
const MapView = ({ position,height }) => {

  return (
    <Box
      sx={{
        width: "100%",
        px:2,
      mx:2,
        height: "350px",
      /*    border: "2px solid transparent",
        background:
          "linear-gradient(white, white) padding-box, linear-gradient(45deg, #FF5733 20%, #FFD700 90%) border-box",
       */ }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "bold",
        }}
      >
        Ubicación en el mapa
      </Typography>
      <Paper
        elevation={3}
        sx={{
          height: height,
          width: "97%",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <MapContainer
          center={position || DEFAULT_POSITION}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
           {/*  <Popup>
              <div>
                <strong>Ubicación seleccionada</strong>
                <br />
                Lat: {position.lat.toFixed(6)|| position}
                <br />
                Lng: {position.lng.toFixed(6)}
              </div>
            </Popup> */}
          </Marker>

          {/* Marker inicial si hay coordenadas */}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default MapView;
