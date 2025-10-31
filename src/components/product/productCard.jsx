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
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Store,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
} from "@mui/icons-material";

export default function ProductCard({
  handleStoreClick,
  product,
  toggleFavorite,
  favorites,
  handleProductClick
}) {
  
  // Función para calcular el rating basado en product.rate
  const calculateRating = (rate) => {
    if (!rate || typeof rate !== 'object') {
      return { rating: 0, sentiment: 'Sin calificaciones', icon: <SentimentSatisfied /> };
    }

    const { good = 0, medium = 0, bad = 0 } = rate;
    const totalVotes = good + medium + bad;
    
    if (totalVotes === 0) {
      return { rating: 0, sentiment: 'Sin calificaciones', icon: <SentimentSatisfied /> };
    }

    // Calcular puntuación (0-5)
    // good = 5 puntos, medium = 3 puntos, bad = 1 punto
    const totalScore = (good * 5) + (medium * 3) + (bad * 1);
    const averageRating = totalScore / totalVotes;
    const normalizedRating = (averageRating / 5) * 5; // Normalizar a escala 0-5

    // Determinar sentimiento basado en el rating
    let sentiment, icon;
    if (normalizedRating >= 4) {
      sentiment = 'Excelente';
      icon = <SentimentVerySatisfied color="success" />;
    } else if (normalizedRating >= 3) {
      sentiment = 'Bueno';
      icon = <SentimentSatisfied color="info" />;
    } else if (normalizedRating >= 2) {
      sentiment = 'Regular';
      icon = <SentimentSatisfied color="warning" />;
    } else {
      sentiment = 'Malo';
      icon = <SentimentDissatisfied color="error" />;
    }

    return {
      rating: Math.min(5, Math.max(0, normalizedRating)), // Asegurar entre 0-5
      sentiment,
      icon,
      totalVotes
    };
  };

  const ratingInfo = calculateRating(product.rate);
  
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => handleProductClick(product.id)}
    >
      {/* Badge de No Disponible */}
      {!product.isActive && (
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
          NO DISPONIBLE
        </Box>
      )}

      {/* Botón de Favoritos */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255,255,255,0.9)",
          zIndex: 1,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,1)",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
      >
        {favorites.has(product.id) ? (
          <Favorite color="error" />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      {/* Imagen del Producto */}
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.nombre}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Categoría */}
        <Chip
          label={product.category}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1 }}
        />

        {/* Nombre del Producto */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {product.name}
        </Typography>

       

        {/* Rating con carita */}
        <Tooltip 
          title={`${ratingInfo.sentiment} • ${ratingInfo.totalVotes || 0} votos`}
          arrow
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            {/* Icono de sentimiento */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {ratingInfo.icon}
            </Box>
            
            {/* Rating numérico */}
            <Rating
              value={ratingInfo.rating}
              precision={0.1}
              size="small"
              readOnly
            />
            
            {/* Texto del rating */}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({ratingInfo.rating.toFixed(1)})
            </Typography>
          </Box>
        </Tooltip>

        {/* Información de la Tienda */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            cursor: "pointer",
          }}
          onClick={(e) => handleStoreClick(product.tienda.id, e)}
        >
          <Store fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            {product.tienda.nombre}
          </Typography>
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {product.tags &&
            product.tags
              .slice(0, 3)
              .map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
        </Box>

        {/* Precio y Botón */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /día
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={!product.isActive}
            sx={{
              background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Aquí iría la lógica para agregar al carrito o alquilar
            }}
          >
            {product.isActive ? "Alquilar" : "No Disponible"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}