import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
  ShoppingCart,
  Favorite,
  Share,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../../services/productServices";
import { useAuth } from "../../../context/AuthContext";
import RatingDetail from "./ratingDetail";

export default function ProductPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const itemData = await productService.getProductItemById(params.id);
      setProduct(itemData);
    } catch (err) {
      console.error("Error cargando producto:", err);
      setError("Error cargando producto: " + err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const productToCart = async () => {
    try {
      setCartError("");
      if (!user) {
        setCartError("Debes iniciar sesión para agregar productos al carrito");
        return;
      }

      await productService.addProductToCart(params.id, user.uid, product.store);
      handleOpenDialog();
    } catch (err) {
      console.error("Error agregando al carrito:", err);
      setCartError(err.message);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  // Mostrar loading mientras se carga
  if (loadingProduct) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando producto...
        </Typography>
      </Container>
    );
  }

  // Mostrar error si hay problema
  if (error || !product) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error">
          {error || "Producto no encontrado"}
        </Alert>
        <Button onClick={loadProduct} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Container>
    );
  }

  // Función para obtener imagen segura
  const getSafeImage = () => {
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    }
    return '/images/default-product.jpg';
  };

  // Función para obtener miniaturas seguras
  const getSafeThumbnails = () => {
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      return product.image;
    }
    return ['/images/default-product.jpg'];
  };

  // Calcular rating basado en product.rate
  const calculateRating = (rate) => {
    if (!rate || typeof rate !== "object") {
      return { rating: 0, totalVotes: 0, sentiment: "Sin calificaciones" };
    }

    const { good = 0, medium = 0, bad = 0 } = rate;
    const totalVotes = good + medium + bad;

    if (totalVotes === 0) {
      return { rating: 0, totalVotes: 0, sentiment: "Sin calificaciones" };
    }

    const totalScore = good * 5 + medium * 3 + bad * 1;
    const averageRating = totalScore / totalVotes;
    const normalizedRating = (averageRating / 5) * 5;

    let sentiment, icon, color;
    if (normalizedRating >= 4) {
      sentiment = "Excelente";
      icon = <SentimentVerySatisfied />;
      color = "success";
    } else if (normalizedRating >= 3) {
      sentiment = "Bueno";
      icon = <SentimentSatisfied />;
      color = "info";
    } else if (normalizedRating >= 2) {
      sentiment = "Regular";
      icon = <SentimentSatisfied />;
      color = "warning";
    } else {
      sentiment = "Malo";
      icon = <SentimentDissatisfied />;
      color = "error";
    }

    return {
      rating: Math.min(5, Math.max(0, normalizedRating)),
      sentiment,
      icon,
      color,
      totalVotes,
      breakdown: { good, medium, bad },
    };
  };

  const ratingInfo = calculateRating(product.rate);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Mostrar error del carrito */}
      {cartError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {cartError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Columna de Imagen */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="500"
              image={getSafeImage()}
              alt={product.name || "Producto"}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Card>

          {/* Miniaturas */}
          <Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto" }}>
            {getSafeThumbnails().map((imageUrl, index) => (
              <CardMedia
                key={index}
                component="img"
                height="80"
                sx={{ width: 80, borderRadius: 1, cursor: "pointer" }}
                image={imageUrl}
                alt={`Miniatura ${index + 1}`}
              />
            ))}
          </Box>
        </Grid>

        {/* Columna de Información */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              {product.name}
            </Typography>
            
            {/* Categoría y Tags */}
            <Box sx={{ mb: 2 }}>
              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(product.tags || []).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                {ratingInfo.icon}
                <Rating
                  value={ratingInfo.rating}
                  precision={0.1}
                  size="large"
                  readOnly
                  sx={{ mx: 1 }}
                />
                <Typography variant="h6" color="text.primary">
                  {ratingInfo.rating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ({ratingInfo.totalVotes} calificaciones)
              </Typography>
            </Box>

            {/* Precio */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h2"
                component="div"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "3rem" },
                }}
              >
                ${(product.price || 0).toFixed(2)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                por día
              </Typography>
            </Box>

            {/* Botones de Acción */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                onClick={() => {
                  productToCart();
                }}
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  flex: 1,
                  py: 1.5,
                  background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
                  },
                }}
              >
                Añadir
              </Button>

              <Button variant="outlined" size="large">
                <Favorite />
              </Button>

              <Button variant="outlined" size="large">
                <Share />
              </Button>
            </Box>

            {/* Información de Disponibilidad */}
            <Alert
              severity={product.isActive ? "success" : "warning"}
              sx={{ mb: 3 }}
            >
              {product.isActive
                ? "✅ Disponible para alquiler inmediato"
                : "⚠️ Actualmente no disponible"}
            </Alert>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Información del Producto
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {product.desc || "Descripción no disponible."}
        </Typography>
      </Box>

      {/* Sección de Rating y Calificaciones */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Calificaciones y Opiniones
        </Typography>
        <RatingDetail ratingInfo={ratingInfo} />
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Producto Agregado al carrito</DialogTitle>
        <DialogContent>
          El producto se ha agregado correctamente al carrito. Recuerde agregar
          productos de la misma tienda al carrito.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Seguir comprando</Button>
          <Button
            onClick={() => navigate(`/store/${product.store}`)}
            variant="contained"
          >
            Ir a tienda
          </Button>
          <Button 
            onClick={() => navigate(`/my_cart/${user?.uid}`)}
            variant="contained"
          >
            Ir al carrito
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}