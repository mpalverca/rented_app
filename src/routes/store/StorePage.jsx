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
  Card,
  CardContent,
  Rating,
  Tab,
  Tabs,
  CardMedia,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Email,
  Phone,
  CalendarToday,
  Share,
  Favorite,
  ShoppingCart,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { storeService } from "../../services/storeServices";
import MapView from "../../components/maps/mapView";

// Datos de ejemplo - en una app real estos vendrían de tu API
const mockStoreData = {
  id: "1",
  name: "TechRent Solutions",
  description:
    "Tu tienda de confianza para alquiler de equipos tecnológicos. Ofrecemos los mejores productos con garantía y soporte técnico.",
  logo: "/static/images/store-logo.jpg",
  coverImage: "/static/images/store-cover.jpg",
  email: "contacto@techrent.com",
  phone: "+1 234 567 8900",
  address: "Av. Tecnológica 123, Ciudad Digital",
  joinDate: "2023-05-15",
  category: "Tecnología",
  tags: ["Electrónica", "Alquiler", "Tecnología", "Gaming"],
  rating: 4.7,
  totalReviews: 128,
  stats: {
    products: 45,
    orders: 892,
    customers: 567,
  },
  social: {
    website: "https://techrent.com",
    facebook: "techrent",
    instagram: "@techrent",
  },
};

const mockProducts = [
  {
    id: "1",
    name: "Laptop Gaming Pro",
    price: 45.99,
    image: "/static/images/products/laptop.jpg",
    category: "Laptops",
    rating: 4.8,
    reviews: 34,
    isActive: true,
  },
  {
    id: "2",
    name: "Cámara DSLR Profesional",
    price: 29.99,
    image: "/static/images/products/camera.jpg",
    category: "Fotografía",
    rating: 4.6,
    reviews: 28,
    isActive: true,
  },
  {
    id: "3",
    name: "Tablet Digitalizadora",
    price: 15.5,
    image: "/static/images/products/tablet.jpg",
    category: "Tablets",
    rating: 4.4,
    reviews: 19,
    isActive: true,
  },
  {
    id: "4",
    name: "Drone 4K",
    price: 39.99,
    image: "/static/images/products/drone.jpg",
    category: "Drones",
    rating: 4.9,
    reviews: 42,
    isActive: false,
  },
  {
    id: "5",
    name: "Consola Gaming",
    price: 25.0,
    image: "/static/images/products/console.jpg",
    category: "Gaming",
    rating: 4.7,
    reviews: 31,
    isActive: true,
  },
  {
    id: "6",
    name: "Smartphone Premium",
    price: 22.99,
    image: "/static/images/products/phone.jpg",
    category: "Smartphones",
    rating: 4.5,
    reviews: 26,
    isActive: true,
  },
];

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
  console.log(store);
  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      try {
        // En una app real, aquí harías llamadas a tu API
        // const storeData = await storeService.getStoreById(storeId);
        // const storeProducts = await productService.getProductsByStore(storeId);

        setTimeout(() => {
          //setStore(mockStoreData);
          setProducts(mockProducts);
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
    navigate(`/product/${productId}`);
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
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                {store.desc}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                <Chip
                  label={store.category}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
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
                Productos de la Tienda
              </Typography>

              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        onClick={() => handleProductClick(product.id)}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom noWrap>
                          {product.name}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Rating
                            value={product.rating}
                            size="small"
                            readOnly
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            ({product.reviews})
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {product.category}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              background:
                                "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              fontWeight: "bold",
                            }}
                          >
                            ${product.price}/día
                          </Typography>

                          <Button
                            size="small"
                            startIcon={<ShoppingCart />}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.isActive}
                            sx={{
                              background:
                                "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
                              color: "white",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #E64A19 20%, #FBC02D 90%)",
                              },
                            }}
                          >
                            Alquilar
                          </Button>
                        </Box>

                        {!product.isActive && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            No disponible
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <Typography
                        variant="h6"
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
                        Información de Contacto
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <LocationOn sx={{ color: "#FF5733", mr: 1 }} />
                          {store.direccion}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Email sx={{ color: "#FF5733", mr: 1 }} />
                          {store.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Phone sx={{ color: "#FF5733", mr: 1 }} />
                          {store.telefono}
                        </Typography>
                      </Box>

                      {/* Redes Sociales */}
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Síguenos en:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {store.social.website && (
                          <Chip
                            label="Sitio Web"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {store.social.facebook && (
                          <Chip
                            label="Facebook"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {store.social.instagram && (
                          <Chip
                            label="Instagram"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 8 }}>
                      <MapView position={store.ubicacion} />
                    </Grid>
                    <Grid item size={{ xs: 12,}}>
                       <Paper variant="outlined" sx={{ p: 2 }}>
                                 <Typography
                        variant="h6"
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
                  </Grid>
                </CardContent>
              </Card>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
