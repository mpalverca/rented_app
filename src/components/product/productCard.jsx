import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  toggleFavorite,
  favorites,
  handleProductClick,
  loading = false,
}) {
  const navigate = useNavigate();

  const getProductImage = (image) => {
    const defaultImage = "https://ih1.redbubble.net/image.1861339560.3228/raf,360x360,075,t,fafafa:ca443f4786.jpg";
    if (!image) return defaultImage;
    if (Array.isArray(image) && image.length > 0) return image[0];
    if (typeof image === "string" && image.trim() !== "") return image;
    return defaultImage;
  };

  const calculateRating = (rate) => {
    if (!rate || typeof rate !== "object") {
      return { rating: 0, sentiment: "Sin calificaciones", icon: <SentimentSatisfied />, totalVotes: 0 };
    }

    const { good = 0, medium = 0, bad = 0 } = rate;
    const totalVotes = good + medium + bad;

    if (totalVotes === 0) {
      return { rating: 0, sentiment: "Sin calificaciones", icon: <SentimentSatisfied />, totalVotes: 0 };
    }

    const totalScore = good * 5 + medium * 3 + bad * 1;
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
    };
  };

  if (loading) {
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Skeleton variant="rectangular" height={190} />
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={100} sx={{ ml: 1 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return null;
  }

  const ratingInfo = calculateRating(product?.rate);
  const productImage = getProductImage(product?.image);

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
      onClick={() => handleProductClick(product?.id)}
    >
      {!product?.isActive && (
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
          toggleFavorite(product?.id);
        }}
      >
        {favorites?.has(product?.id) ? (
          <Favorite color="error" />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      <CardMedia
        component="img"
        height="190"
        image={productImage}
        alt={product?.name || "Producto"}
        sx={{
          objectFit: "cover",
          width: "90%",
          m: "auto",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="body1"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
        >
          {product?.name || "Sin nombre"}
        </Typography>

        <Tooltip
          title={`${ratingInfo.sentiment} • ${ratingInfo.totalVotes} votos`}
          arrow
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {ratingInfo.icon}
            </Box>
            <Rating
              value={ratingInfo.rating}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              ({ratingInfo.rating.toFixed(1)})
            </Typography>
          </Box>
        </Tooltip>
      </CardContent>
    </Card>
  );
}