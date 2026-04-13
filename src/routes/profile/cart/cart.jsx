// components/Cart.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Alert,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { cartService } from "../../../services/cartServices";
import { useNavigate, useParams } from "react-router-dom";
import CartTable from "./cartTable";
import MapContainer from "../../../components/maps/mapContainer";
import rentedServices from "../../../services/rentedServices";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkV, setCheckV] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().slice(0, 16),
    endDate: "",
    note: "",
    reference: "",
  });
  const { userId } = useParams();
  const navigate = useNavigate();

  const steps = ["Fechas y Productos", "Ubicación", "Confirmar Pedido"];

  const handleCoordinatesChange = (lat, lng) => {
    setCoordinates({ lat, lng });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setRentalDates((prev) => ({
          ...prev,
          reference: data.display_name,
        }));
      }
    } catch (error) {
      console.error("Error en reverse geocoding:", error);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [userId]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const { cart } = await cartService.getUserCart(userId);
      const product = await cartService.getCartProductsDetails(cart);
      setCartItems(product);
    } catch (err) {
      setError("Error cargando el carrito: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateRentalDays = () => {
    if (!rentalDates.startDate || !rentalDates.endDate) return 0;

    const start = new Date(rentalDates.startDate);
    const end = new Date(rentalDates.endDate);

    if (end <= start) return 0;

    let diffDays = 0;
    let currentDate = new Date(start);

    while (currentDate < end) {
      if (currentDate.getDay() !== 0) {
        diffDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return diffDays - 1;
  };

  const handleDateChange = (field, value) => {
    setRentalDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-EC", options);
  };

  const removeFromCart = async (userId, productId) => {
    try {
      await cartService.deleteProductCart(userId, productId);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      setError("Error eliminando producto: " + error.message);
    }
  };

  const calculateProductSubtotal = ({ quantity, price }) => {
    if (!quantity) return 0;
    const days = calculateRentalDays();
    const quantityv = quantity || 1;
    const priceV = price || 0;
    return days * quantityv * priceV;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, cartItems) => {
      return (
        total +
        calculateProductSubtotal({
          quantity: cartItems.quantity,
          price: cartItems.subproducto?.price || 0,
        })
      );
    }, 0);
  };

  const rentalDays = calculateRentalDays();
  const totalAmount = calculateTotal().toFixed(2);

  const AddToRented = async () => {
    if (!coordinates) {
      setError("Por favor selecciona una ubicación de entrega");
      return;
    }
    if (rentalDays <= 0) {
      setError("Por favor selecciona fechas válidas de alquiler");
      return;
    }
    if (cartItems.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    const productToRented = {
      product: cartItems,
      dates: {
        dateInit: rentalDates.startDate,
        dateEnd: rentalDates.endDate,
      },
      reference: rentalDates.reference,
      notes: [
        {
          by: userId,
          date: Date.now(),
          note: rentalDates.note || "Sin notas adicionales",
        },
      ],
      days: rentalDays,
      total: parseFloat(totalAmount),
      state: "iniciado",
      location: [coordinates.lat, coordinates.lng],
      carInit: { required: checkV },
      cartEnd: { required: checkV },
      client: userId,
      store: cartItems[0]?.store,
    };
    
    const rented = await rentedServices.createRented(
      productToRented,
      userId,
      cartItems[0]?.store
    );
    if (rented === true) {
      navigate(`/my_profile/${userId}/rented`);
    }
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Typography variant="h6">🔄 Cargando carrito...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "white", borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCartIcon sx={{ fontSize: 35, color: "#1976d2" }} />
          Mi Carrito
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Revisa los productos, selecciona fechas y confirma tu pedido
        </Typography>
      </Paper>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Grid container spacing={3}>
          {/* Columna principal - Fechas y Tabla de productos */}
          <Grid item size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              {/* Sección de fechas integrada */}
              <CardContent sx={{ bgcolor: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Fechas de Alquiler
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <DateTimePicker
                      label="Fecha y Hora de Inicio *"
                      value={rentalDates.startDate ? new Date(rentalDates.startDate) : null}
                      onChange={(newValue) =>
                        handleDateChange("startDate", newValue ? newValue.toISOString().slice(0, 16) : "")
                      }
                      minDateTime={new Date()}
                      slotProps={{
                        textField: { fullWidth: true, variant: "outlined" },
                      }}
                    />
                    {rentalDates.startDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        📅 Inicio: {formatDateTime(rentalDates.startDate)}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <DateTimePicker
                      label="Fecha y Hora de Devolución *"
                      value={rentalDates.endDate ? new Date(rentalDates.endDate) : null}
                      onChange={(newValue) =>
                        handleDateChange("endDate", newValue ? newValue.toISOString().slice(0, 16) : "")
                      }
                      minDateTime={rentalDates.startDate ? new Date(rentalDates.startDate) : new Date()}
                      slotProps={{
                        textField: { fullWidth: true, variant: "outlined" },
                      }}
                    />
                    {rentalDates.endDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        📅 Devolución: {formatDateTime(rentalDates.endDate)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {rentalDates.startDate && rentalDates.endDate && rentalDays === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    ⚠️ La fecha de devolución debe ser posterior a la fecha de inicio
                  </Alert>
                )}

                {rentalDays > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <strong>📊 {rentalDays} día{rentalDays !== 1 ? "s" : ""} de alquiler</strong>
                      <Typography variant="caption" color="text.secondary">
                        • Del {formatDateTime(rentalDates.startDate)} al {formatDateTime(rentalDates.endDate)}
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </CardContent>

              {/* Tabla de productos */}
              {cartItems.length === 0 ? (
                <CardContent>
                  <Alert severity="info">
                    Tu carrito está vacío. ¡Agrega algunos productos!
                  </Alert>
                </CardContent>
              ) : (
                <CartTable
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  calculateProductSubtotal={calculateProductSubtotal}
                  rentalDays={rentalDays}
                  removeFromCart={removeFromCart}
                  subtotal={totalAmount}
                  userId={userId}
                />
              )}
            </Card>
          </Grid>

          {/* Columna lateral - Resumen y ubicación */}
          <Grid item size={{ xs: 12, lg: 4 }}>
            {/* Tarjeta de resumen */}
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ReceiptIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Resumen del Pedido
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${totalAmount}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Días de alquiler:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {rentalDays} días
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Productos:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {cartItems.length} items
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ${totalAmount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Tarjeta de ubicación */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Ubicación de Entrega
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={getCurrentLocation}
                  startIcon={<LocationOnIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Usar mi ubicación actual
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setShowMap(!showMap)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {showMap ? "Ocultar mapa" : "Seleccionar en mapa"}
                </Button>

                <Collapse in={showMap}>
                  <Box sx={{ mb: 2 }}>
                    <MapContainer onCoordinatesChange={handleCoordinatesChange} />
                  </Box>
                </Collapse>

                {coordinates && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    📍 Ubicación seleccionada
                    <Typography variant="caption" display="block">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </Typography>
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Referencia de ubicación"
                  value={rentalDates.reference}
                  onChange={(e) => handleDateChange("reference", e.target.value)}
                  placeholder="Ej: Casa de color rojo, cerca al parque"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkV}
                      onChange={(e) => setCheckV(e.target.checked)}
                    />
                  }
                  label="🚗 Requiere vehículo de transporte"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Notas adicionales (opcional)"
                  multiline
                  rows={2}
                  value={rentalDates.note}
                  onChange={(e) => handleDateChange("note", e.target.value)}
                  placeholder="Indicaciones especiales para la entrega..."
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  ⏰ Verifica los horarios de atención de la tienda
                </Typography>

                <Button
                  onClick={AddToRented}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={cartItems.length === 0 || rentalDays === 0 || !coordinates}
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
                  }}
                >
                  Confirmar Pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default Cart;