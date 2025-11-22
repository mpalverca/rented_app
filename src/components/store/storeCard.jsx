import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Store,
  LocationOn,
  Phone,
  Email,
  Schedule,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
} from "@mui/icons-material";

export default function StoreCard({ store, onStoreClick }) {
  // Función para calcular el rating basado en store.review
  const calculateRating = (review) => {
    if (!review || typeof review !== "object") {
      return {
        rating: 0,
        sentiment: "Sin calificaciones",
        icon: <SentimentSatisfied />,
      };
    }

    const { good = 0, medio = 0, bad = 0 } = review;
    const totalVotes = good + medio + bad;

    if (totalVotes === 0) {
      return {
        rating: 0,
        sentiment: "Sin calificaciones",
        icon: <SentimentSatisfied />,
      };
    }

    // Calcular puntuación (0-5)
    const totalScore = good * 5 + medio * 3 + bad * 1;
    const averageRating = totalScore / totalVotes;
    const normalizedRating = (averageRating / 5) * 5;

    let sentiment, icon;
    if (normalizedRating >= 4) {
      sentiment = "Excelente";
      icon = <SentimentVerySatisfied color="success" />;
    } else if (normalizedRating >= 3) {
      sentiment = "Bueno";
      icon = <SentimentSatisfied color="info" />;
    } else if (normalizedRating >= 2) {
      sentiment = "Regular";
      icon = <SentimentSatisfied color="warning" />;
    } else {
      sentiment = "Malo";
      icon = <SentimentDissatisfied color="error" />;
    }

    return {
      rating: Math.min(5, Math.max(0, normalizedRating)),
      sentiment,
      icon,
      totalVotes,
      breakdown: { good, medio, bad }
    };
  };

  const ratingInfo = calculateRating(store.review);

  // Función para formatear el horario
  const formatSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule)) return "Horario no disponible";
    
    const today = new Date().getDay();
    const todaySchedule = schedule[today];
    
    if (!todaySchedule || !todaySchedule.open) return "Cerrado hoy";
    
    return `Abierto hoy: ${todaySchedule.start} - ${todaySchedule.end}`;
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: 'hidden',
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => onStoreClick(store.id)}
    >
      {/* Estado de la tienda */}
      {!store.activa && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "error.main",
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: "bold",
            zIndex: 1,
          }}
        >
          INACTIVA
        </Box>
      )}

      {/* Imagen de la tienda */}
      <CardMedia
        component="img"
        height="200"
        image={store.imagen || "https://www.aceroform.com.mx/wp-content/uploads/2020/10/banner-construccion-1200x675.jpg"}
        alt={store.nombre}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Nombre de la tienda */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ 
            fontWeight: "bold",
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          {store.nombre}
        </Typography>
        {/* Rating */}
        <Tooltip
          title={`${ratingInfo.sentiment} • ${ratingInfo.breakdown?.good}👍 ${ratingInfo.breakdown?.medio}👌 ${ratingInfo.breakdown?.bad}👎`}
          arrow
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            {ratingInfo.icon}
            <Rating value={ratingInfo.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({ratingInfo.rating.toFixed(1)})
            </Typography>
          </Box>
        </Tooltip>

        <Divider sx={{ my: 2 }} />

        {/* Información de contacto */}
        <Box sx={{ mb: 2 }}>
          {store.direccion && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {store.direccion}
              </Typography>
            </Box>
          )}
          
          {store.telefono && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {store.telefono}
              </Typography>
            </Box>
          )}

          {store.schedule && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Schedule sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {formatSchedule(store.schedule)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {store.tags && store.tags.length > 0 && (
          <Box sx={{ mb: 0, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {store.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
            {store.tags.length > 3 && (
              <Chip
                label={`+${store.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        )}

      </CardContent>

      {/* Botón de acción */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!store.activa}
          onClick={(e) => {
            e.stopPropagation();
            onStoreClick(store.id);
          }}
          sx={{
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            color: "white",
            fontWeight: "bold",
            py: 1,
            "&:hover": {
              background: "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {store.activa ? "Visitar Tienda" : "Tienda Inactiva"}
        </Button>
      </Box>
    </Card>
  );
}