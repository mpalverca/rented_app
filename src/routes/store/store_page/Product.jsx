import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Box,
  Button,
  Alert,
  Container,
  CircularProgress,
} from "@mui/material";

import { ShoppingCart } from "@mui/icons-material";
import { useInfiniteProductsStore } from "../../../components/product/infinityScroll";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductStore({ handleAddToCart, handleProductClick }) {
  const { storeId: id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    error: productsError,
    refresh,
  } = useInfiniteProductsStore();

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        // Cargar datos de la tienda
        // const storeData = await storeService.getStoreById(storeId);
      } catch (err) {
        console.error("Error cargando tienda:", err);
        setError("Error cargando información de la tienda");
      }
    };

    loadStoreData();
  }, [id]);
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
  return (
    <>
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
        Productos de la Tienda
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
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
                <Typography variant="body1" gutterBottom noWrap>
                  {product.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating value={product.rating} size="small" readOnly />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({product.reviews})
                  </Typography>
                </Box>

                {/*  <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.category}
                </Typography> */}

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

                  {/*   <Button
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
                  </Button> */}
                </Box>

                {/* {!product.isActive && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    No disponible
                  </Alert>
                )} */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
