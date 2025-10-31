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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
  ShoppingCart,
  Favorite,
  Share,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { productService } from "../../../services/productServices";
export default function ProductPage() {
  const [selectedRating, setSelectedRating] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const itemData = await productService.getProductItemById(params.id);
      setProduct(itemData);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("Error cargando productos: " + err.message);
      setProduct([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProducts();
    setLoading(true);
  }, {});

  if (!product) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando producto...
        </Typography>
      </Container>
    );
  }

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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const ratingDescriptions = {
    good: {
      title: "👍 Bueno",
      description:
        "El producto cumple con lo esperado, en buen estado y funciona correctamente. Recomendado para uso regular.",
      color: "success",
      
    },
    medium: {
      title: "😐 Regular",
      description:
        "El producto tiene algunos signos de uso pero funciona adecuadamente. Puede tener detalles estéticos menores.",
      color: "warning",
    },
    bad: {
      title: "👎 Malo",
      description:
        "El producto requiere mantenimiento o tiene fallas funcionales. Se recomienda revisión antes del uso.",
      color: "error",
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Columna de Imagen */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="500"
              image={product.image}
              alt={product.name}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Card>

          {/* Miniaturas (opcional) */}
          <Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto" }}>
            <CardMedia
              component="img"
              height="80"
              sx={{ width: 80, borderRadius: 1, cursor: "pointer" }}
              image={product.image}
              alt="Miniatura"
            />
            {/* Puedes agregar más miniaturas aquí si tienes más imágenes */}
          </Box>
        </Grid>

        {/* Columna de Información */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
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
                {product.tags?.map((tag, index) => (
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
                ${product.price.toFixed(2)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                por día
              </Typography>
            </Box>

            {/* Botones de Acción */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  flex: 1,
                  py: 1.5,
                  background:
                    "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
                  },
                }}
              >
                Alquilar Ahora
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

        <Grid container spacing={4}>
          {/* Resumen de Rating */}
          <Grid item size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {ratingInfo.icon}
                <Typography variant="h3" sx={{ ml: 1, fontWeight: "bold" }}>
                  {ratingInfo.rating.toFixed(1)}
                </Typography>
              </Box>
              <Rating
                value={ratingInfo.rating}
                precision={0.1}
                size="large"
                readOnly
              />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {ratingInfo.sentiment}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Basado en {ratingInfo.totalVotes} opiniones
              </Typography>
            </Paper>

            {/* Desglose de Calificaciones */}
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Desglose de Calificaciones
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">👍 Bueno</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {ratingInfo.breakdown.good}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">😐 Regular</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {ratingInfo.breakdown.medium}
                  </Typography>
                </Box>

                <Box sx={{ display: "-flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">👎 Malo</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {ratingInfo.breakdown.bad}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          {/* Acordeón de Explicación de Calificaciones */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              ¿Qué significan las calificaciones?
            </Typography>

            {Object.entries(ratingDescriptions).map(([key, desc]) => (
              <Accordion
                key={key}
                expanded={expanded === key}
                onChange={handleAccordionChange(key)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: `${desc.color}.main`,
                      }}
                    >
                      {desc.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {desc.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Box>

      {/* Información Adicional (opcional) */}
    </Container>
  );
}
