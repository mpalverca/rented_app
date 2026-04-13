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
  Stack,
  Paper,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  Share,
  CheckCircle,
  Inventory,
  LocalShipping,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../../services/productServices";
import { useAuth } from "../../../context/AuthContext";
import RatingDetail from "./ratingDetail";

export default function ProductPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSubproduct, setSelectedSubproduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const itemData = await productService.getProductItemById(
        params.productId,
      );
      setProduct(itemData);
      if (itemData.suproducts?.length > 0) {
        const firstAvailable =
          itemData.suproducts.find((sp) => sp.stock > 0) ||
          itemData.suproducts[0];
        setSelectedSubproduct(firstAvailable);
        setSelectedImage(itemData.image?.[0] || "/images/default-product.jpg");
      }
    } catch (err) {
      console.error("Error cargando producto:", err);
      setError("Error cargando producto: " + err.message);
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
      if (!selectedSubproduct) {
        setCartError("Selecciona una variante del producto");
        return;
      }

      await productService.addProductToCart(
        params.productId,
        user.uid,
        product.store,
        {
          sku: selectedSubproduct.sku,
          price: selectedSubproduct.price,
          name: selectedSubproduct.name,
          quantity: quantity,
        },
      );
      setOpenDialog(true);
    } catch (err) {
      console.error("Error agregando al carrito:", err);
      setCartError(err.message);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [params.productId]);

  const handleSubproductSelect = (subproduct) => {
    setSelectedSubproduct(subproduct);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= 1 &&
      value <= (selectedSubproduct?.stock || 999)
    ) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (selectedSubproduct?.stock || 999)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getSafeImages = () => {
    if (
      product?.image &&
      Array.isArray(product.image) &&
      product.image.length > 0
    ) {
      return product.image;
    }
    return ["/images/default-product.jpg"];
  };

  const calculateRating = () => {
    if (!product?.rate || typeof product.rate !== "object") {
      return { rating: 0, totalVotes: 0 };
    }
    const { good = 0, medium = 0, bad = 0 } = product.rate;
    const totalVotes = good + medium + bad;
    if (totalVotes === 0) return { rating: 0, totalVotes: 0 };
    const totalScore = good * 5 + medium * 3 + bad * 1;
    const averageRating = totalScore / totalVotes;
    return { rating: Math.min(5, Math.max(0, averageRating)), totalVotes };
  };

  const ratingInfo = calculateRating();
  const subtotal = (selectedSubproduct?.price || 0) * quantity;

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Cargando producto...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error">{error || "Producto no encontrado"}</Alert>
        <Button onClick={loadProduct} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Container>
    );
  }

  const images = getSafeImages();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Columna de Imágenes */}
        <Grid item size={{ xs: 12, md: 6 }}>
          {/* Imagen principal */}
          <Card
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardMedia
              component="img"
              height={isMobile ? 300 : 450}
              image={selectedImage || images[0]}
              alt={product.name}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />
          </Card>

          {/* Miniaturas */}
          {images.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "divider",
                  borderRadius: 3,
                },
              }}
            >
              {images.map((imageUrl, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(imageUrl)}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImage === imageUrl ? "2px solid" : "1px solid",
                    borderColor:
                      selectedImage === imageUrl ? "primary.main" : "divider",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Miniatura ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Columna de Información */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Título y categoría */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: { xs: "1.75rem", md: "2rem" } }}
            >
              {product.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip label={product.category} size="small" variant="outlined" />
              {product.brand && (
                <Chip label={product.brand} size="small" variant="outlined" />
              )}
            </Box>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Rating
                value={ratingInfo.rating}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                {ratingInfo.rating.toFixed(1)} ({ratingInfo.totalVotes}{" "}
                opiniones)
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Selección de Subproductos */}
            {product.suproducts && product.suproducts.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 1.5 }}
                >
                  Variantes disponibles
                </Typography>
                <Stack direction="row" spacing={1}>
                  {product.suproducts.map((subproduct) => {
                    const isSelected =
                      selectedSubproduct?.sku === subproduct.sku;
                    const isOutOfStock = subproduct.stock === 0;

                    return (
                     
                        <Paper
                     key={subproduct.sku}
                          onClick={() =>
                            !isOutOfStock && handleSubproductSelect(subproduct)
                          }
                          elevation={0}
                          sx={{
                            p: 1.5,
                            minWidth: 120,
                            cursor: isOutOfStock ? "not-allowed" : "pointer",
                            opacity: isOutOfStock ? 0.5 : 1,
                            border: "1px solid",
                            borderColor: isSelected
                              ? "primary.main"
                              : "divider",
                            bgcolor: isSelected
                              ? "action.hover"
                              : "background.paper",
                            transition: "all 0.2s ease",
                            "&:hover": !isOutOfStock && {
                              borderColor: "primary.main",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {subproduct.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            ${subproduct.price?.toFixed(2)}
                          </Typography>
                          <Chip
                            label={
                              isOutOfStock
                                ? "Agotado"
                                : subproduct.stock < 5
                                  ? `Últimos ${subproduct.stock}`
                                  : "Disponible"
                            }
                            size="small"
                            color={
                              isOutOfStock
                                ? "error"
                                : subproduct.stock < 5
                                  ? "warning"
                                  : "success"
                            }
                            sx={{ mt: 1, fontSize: "0.7rem", height: 20 }}
                          />
                        </Paper>
                     
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Precio y Cantidad */}
            {selectedSubproduct && selectedSubproduct.stock > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 2,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Precio unitario
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "2rem", md: "2.5rem" },
                      }}
                    >
                      ${selectedSubproduct.price?.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Cantidad
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                      >
                        -
                      </IconButton>
                      <TextField
                        value={quantity}
                        onChange={handleQuantityChange}
                        type="number"
                        inputProps={{
                          min: 1,
                          max: selectedSubproduct.stock,
                          style: { textAlign: "center", width: 60 },
                        }}
                        size="small"
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        onClick={incrementQuantity}
                        disabled={quantity >= selectedSubproduct.stock}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                      >
                        +
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {selectedSubproduct.stock} unidades
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Subtotal: ${subtotal.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {quantity} × ${selectedSubproduct.price?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {/* Botones de Acción */}
            <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
              <Button
                disabled={!selectedSubproduct || selectedSubproduct.stock === 0}
                onClick={productToCart}
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                fullWidth
                sx={{ py: 1.5, textTransform: "none", fontWeight: 600 }}
              >
                {selectedSubproduct?.stock === 0
                  ? "Agotado"
                  : "Agregar al carrito"}
              </Button>
              <IconButton
                variant="outlined"
                size="large"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Favorite />
              </IconButton>
              <IconButton
                variant="outlined"
                size="large"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Share />
              </IconButton>
            </Box>

            {cartError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {cartError}
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Descripción del Producto */}
      <Box sx={{ mt: 2}}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Descripción
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {product.desc || "Descripción no disponible."}
        </Typography>
      </Box>

      {/* Especificaciones */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Especificaciones
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Grid item size={{ xs: 6, sm: 4 }} key={key}>
                  <Typography variant="caption" color="text.secondary">
                    {key}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

      {/* Sección de Calificaciones */}
      {product.rate &&
        (product.rate.good > 0 ||
          product.rate.medium > 0 ||
          product.rate.bad > 0) && (
          <Box sx={{ mt: 3, pb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Calificaciones y Opiniones
            </Typography>
            <RatingDetail ratingInfo={ratingInfo} />
          </Box>
        )}

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle color="success" />
          Producto agregado al carrito
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            El producto se ha agregado correctamente. Recuerda que solo puedes
            alquilar productos de una misma tienda por pedido.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="text">
            Seguir comprando
          </Button>
          <Button
            onClick={() => navigate(`/store/${product.store}`)}
            variant="outlined"
          >
            Ver tienda
          </Button>
          <Button
          
            onClick={() => navigate(`/my_profile/${user?.uid}/my_cart`)}
            variant="contained"
          >
            Ir al carrito
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
