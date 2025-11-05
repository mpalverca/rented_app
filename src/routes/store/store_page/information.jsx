import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import React from "react";
import {
  LocationOn,
  Email,
  Phone,
  //CalendarToday,
} from "@mui/icons-material";
import MapView from "../../../components/maps/mapView";
import { Link } from "react-router-dom";

export default function Information({ store }) {
  return (
    <Card
      elevation={2}
      sx={{
        border: "2px solid transparent",
        background:
          "linear-gradient(white, white) padding-box, linear-gradient(45deg, #FF5733 20%, #FFD700 90%) border-box",
      }}
    >
      <CardContent>
        <Grid container>
          <Grid item size={{ xs: 12, md: 6 }}>
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
              Información de Contacto
            </Typography>

            <Box sx={{ mb: 0 }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <LocationOn sx={{ color: "#FF5733", mr: 1 }} />
                {store.direccion}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Email sx={{ color: "#FF5733", mr: 1 }} />
                {store.email}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Phone sx={{ color: "#FF5733", mr: 1 }} />
                {store.telefono}
              </Typography>
            </Box>

            {/* Redes Sociales */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Síguenos en:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {store.social.website && (
                <Chip
                  label={store.social.website}
                  size="small"
                  variant="outlined"
                />
              )}
              {store.social.facebook && (
                <Chip
                  label={store.social.facebook}
                  size="small"
                  variant="outlined"
                />
              )}
              {store.social.instagram && (
                <Chip
                //onClick={()=>Link()}
                  label={store.social.instagram}
                  size="small"
                  variant="outlined"
                />
              )}
              {store.social.tiktok && (
                <Chip
                  label={store.social.tiktok}
                  size="small"
                  variant="outlined"
                />
              )}
               {store.social.x && (
                <Chip
                  label={store.social.x}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, md:6 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  background:
                    "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: "bold",
                }}
              >
                Horario de atención
              </Typography>
              {store.schedule.map((day) => (
                <Box
                  key={day.day}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {day.day}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {day.enabled ? (
                      <>
                        {day.time_am &&
                          day.time_am[0] &&
                          `${day.time_am[0]} - ${day.time_am[1]}`}
                        {day.time_pm &&
                          day.time_pm[0] &&
                          `, ${day.time_pm[0]} - ${day.time_pm[1]}`}
                        {!day.time_am[0] && !day.time_pm[0] && "Cerrado"}
                      </>
                    ) : (
                      "Cerrado"
                    )}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item size={{ xs: 12, md: 12 }}>
            <MapView position={store.ubicacion} height={"500px"} />
          </Grid>
          
        </Grid>
      </CardContent>
    </Card>
  );
}
