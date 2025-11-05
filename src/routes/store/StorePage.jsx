import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Box,
  Chip,
  Rating,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { storeService } from "../../services/storeServices";
import Information from "./store_page/information";
import ProductStore from "./store_page/Product";
// Datos de ejemplo - en una app real estos vendrían de tu API

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StoreProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      try {
         setTimeout(() => {
          //setStore(mockStoreData);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error cargando tienda:", err);
        setError("Error cargando información de la tienda");
        setLoading(false);
      }
    };
    if (id) {
      loadItem();
    }
    loadStoreData();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const itemData = await storeService.getStoreItem(id);
      setStore(itemData);
    } catch (err) {
      console.error("Error cargando item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductClick = (productId) => {
    navigate(`product/${productId}`);
  };

  const handleAddToCart = (product) => {
    // Aquí iría la lógica para agregar al carrito
    console.log("Agregar al carrito:", product);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando tienda...
        </Typography>
      </Container>
    );
  }

  if (error || !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Tienda no encontrada"}</Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header de la Tienda */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          overflow: "hidden",
          mb: 3,
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          color: "white",
        }}
      >
        <Box sx={{ position: "relative", p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Logo y Botón Seguir */}
            <Grid item size={{ xs: 12, md: 3 }} sx={{ textAlign: "center" }}>
              <Avatar
                src={store.imagen}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  border: "4px solid white",
                  boxShadow: 3,
                }}
              />
              {/*  <Button
                variant="contained"
                sx={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#FF5733",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "white",
                  },
                }}
              >
                Seguir Tienda
              </Button> */}
            </Grid>

            {/* Información Principal */}
            <Grid item size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                {store.nombre}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0, opacity: 0.9 }}>
                {store.desc}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                <Rating value={store.rating} precision={0.1} readOnly />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
                  {store.rating}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.9 }}>
                  ({store.totalReviews} reseñas)
                </Typography>
              </Box>

              {/* Categoría y Tags */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
               {/*  <Chip
                  label={store.category}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                /> */}
                {/* {store.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                ))} */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Contenido Principal */}
      <Grid container spacing={3}>
        {/* Información de Contacto */}

        {/* Tabs y Productos */}
        <Grid item size={{ xs: 12 }}>
          <Paper elevation={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#FF5733",
                    fontWeight: "bold",
                  },
                },
                "& .MuiTabs-indicator": {
                  background:
                    "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                },
              }}
            >
              <Tab label="Productos" />
              <Tab label="Reseñas" />
              <Tab label="Información" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <ProductStore products={products} handleAddToCart={handleAddToCart} handleProductClick={handleProductClick}/>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
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
                Reseñas de la Tienda
              </Typography>
              <Typography color="text.secondary">
                La tienda tiene una calificación de {store.rating} estrellas
                basada en {store.totalReviews} reseñas.
              </Typography>
              {/* Aquí irían las reseñas específicas */}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Information store={store} />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
