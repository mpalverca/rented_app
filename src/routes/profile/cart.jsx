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
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { cartService } from "../../services/cartServices";
import { useNavigate, useParams } from "react-router-dom";
import CartTable from "./cart/cartTable";
import MapContainer from "../../components/maps/mapContainer";
import rentedServices from "../../services/rentedServices";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkV, setCheckV] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().slice(0, 16),
    endDate: "",
    note: "",
    reference: "",
  });
  const { userId } = useParams();
  const navigate = useNavigate();

  // Esta función recibe las coordenadas del mapa y actualiza el estado
  const handleCoordinatesChange = (lat, lng) => {
    /* setRentalDates((prev) => ({
    ...prev,
    coordinates: {
      lat: lat.toString(),  // Convierte a string
      lng: lng.toString()   // Convierte a string
    }
  })); */
    setCoordinates({
      lat: lat, // Convierte a string
      lng: lng,
    });
  };

  // Cargar datos del carrito
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
  // Calcular días de alquiler
  const calculateRentalDays = () => {
    if (!rentalDates.startDate || !rentalDates.endDate) return 0;

    const start = new Date(rentalDates.startDate);
    const end = new Date(rentalDates.endDate);

    // Validar que la fecha de fin sea posterior a la de inicio
    if (end <= start) return 0;

    let diffDays = 0;
    let currentDate = new Date(start);

    // Recorrer día por día excluyendo domingos (día 0)
    while (currentDate < end) {
      // Si no es domingo (0), contar el día
      if (currentDate.getDay() !== 0) {
        diffDays++;
      }
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const finalDate = diffDays - 1;
    return finalDate;
  };

  // Manejar cambio de fechas
  const handleDateChange = (field, value) => {
    setRentalDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Función para formatear fecha y hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    const date = new Date(dateTimeString);

    // Formato: "15 de enero de 2024, 14:30"
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("es-EC", options);
  };
  // Eliminar producto
  const removeFromCart = async (userId, productId) => {
    try {
      await cartService.deleteProductCart(userId, productId);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      setError("Error eliminando producto: " + error.message);
    }
  };
  // Calcular subtotal por producto
  // En tu componente Cart.jsx
  // Calcular subtotal por producto
  const calculateProductSubtotal = (product) => {
    if (!product) {
      console.warn("Producto undefined en calculateProductSubtotal");
      return 0;
    }

    const days = calculateRentalDays();
    const quantity = product.quantity || 1;
    const price = product.price || 0;

    return days * quantity * price;
  };
  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce((total, product) => {
      return total + calculateProductSubtotal(product);
    }, 0);
  };

  const rentalDays = calculateRentalDays();
  const AddToRented = async (store) => {
    const productToRented = {
      product: cartItems,
      dates: {
        dateInit: Date(rentalDates.startDate),
        dateEnd: rentalDates.endDate,
      },
      reference: "reference",
      notes: [
        {
          by: userId,
          date: Date.now(),
          note: "fdfdf",
        },
      ],
      days: rentalDays,
      total: parseFloat(calculateTotal().toFixed(2)),
      state: "iniciado",
      location: [coordinates.lat, coordinates.lng],
      carInit: {
        required: checkV,
      },
      cartEnd: {
         required: checkV,
      },
      client: userId,
      store: cartItems[0].store,
    };
    const rented = await rentedServices.createRented(
      productToRented,
      userId,
      cartItems[0].store
    );
    if (rented == true) {
      navigate(`/my_profile/${userId}/rented`);
    }
  };

  if (loading) return <Typography>Cargando carrito...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Título */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        🛒 Carrito
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Grid container spacing={3}>
          {/* Sección de Fechas y Nota */}
          <Grid item size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📅 Fechas de Alquiler
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 6 }}>
                    <DateTimePicker
                      label="Fecha y Hora de Inicio"
                      value={
                        rentalDates.startDate
                          ? new Date(rentalDates.startDate)
                          : null
                      }
                      onChange={(newValue) =>
                        handleDateChange(
                          "startDate",
                          newValue ? newValue.toISOString().slice(0, 16) : ""
                        )
                      }
                      minDateTime={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                        },
                      }}
                    />
                    {rentalDates.startDate && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        📅 Inicio: {formatDateTime(rentalDates.startDate)}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6 }}>
                    <DateTimePicker
                      label="Fecha y Hora de Devolución"
                      value={
                        rentalDates.endDate
                          ? new Date(rentalDates.endDate)
                          : null
                      }
                      onChange={(newValue) =>
                        handleDateChange(
                          "endDate",
                          newValue ? newValue.toISOString().slice(0, 16) : ""
                        )
                      }
                      minDateTime={
                        rentalDates.startDate
                          ? new Date(rentalDates.startDate)
                          : new Date()
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                        },
                      }}
                    />
                    {rentalDates.endDate && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        📅 Devolución: {formatDateTime(rentalDates.endDate)}
                      </Typography>
                    )}
                  </Grid>
                  {rentalDates.startDate &&
                    rentalDates.endDate &&
                    rentalDays === 0 && (
                      <Grid item xs={12}>
                        <Alert severity="warning" icon={false}>
                          <Typography variant="body2">
                            ⚠️ La fecha de devolución debe ser posterior a la
                            fecha de inicio
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                </Grid>
                <Typography
                  variant="subtitle2"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  Verifique los horarios de atencion de la tienda donde
                  alquilará los productos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabla de Productos */}
          <Grid item size={{ xs: 12 }}>
            <CartTable
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              calculateProductSubtotal={calculateProductSubtotal}
              rentalDays={rentalDays}
              removeFromCart={removeFromCart} // ← SIN paréntesis
              subtotal={calculateTotal().toFixed(2)}
              userId={userId} // ← Asegúrate de pasar userId si lo necesitas
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <MapContainer onCoordinatesChange={handleCoordinatesChange} />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                {/* Mostrar coordenadas seleccionadas */}
                <Typography variant="h6" gutterBottom>
                  📋 Resumen del Pedido
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  📍 Coordenadas seleccionadas:
                </Typography>
                {coordinates && (
                  <Box>
                    {" "}
                    <Typography variant="body2">
                      Ubicación:{" "}
                      {`${coordinates.lat}, ${coordinates.lng}` ||
                        "No seleccionada"}
                    </Typography>
                  </Box>
                )}
                <TextField
                  fullWidth
                  label="Referencia"
                  multiline
                  rows={1}
                  value={rentalDates.reference}
                  onChange={(e) => handleDateChange("note", e.target.value)}
                  placeholder="Referecnia de ubicación"
                  variant="outlined"
                />
                {rentalDays > 0 && (
                  <Grid itemsize={{ xs: 12, md: 6 }}>
                    <Alert severity="info" icon={false}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          📊 Resumen del período:
                        </Typography>
                        <br />
                        <Typography variant="body2">
                          <strong>
                            {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                          </strong>{" "}
                          de alquiler
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                          • Del {formatDateTime(rentalDates.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Al {formatDateTime(rentalDates.endDate)}
                        </Typography>
                      </Box>
                    </Alert>
                  </Grid>
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      value={setCheckV}
                      onChange={(e) => setCheckV(e.target.checked)}
                    />
                  }
                  label="Requiere vehiculo de trasporte"
                />

                <TextField
                  fullWidth
                  label="Nota importante"
                  multiline
                  rows={2}
                  value={rentalDates.note}
                  onChange={(e) => handleDateChange("note", e.target.value)}
                  placeholder="Verifique la fecha y hora de entrega de la tienda"
                  variant="outlined"
                />
                <Button
                  onClick={() => AddToRented()}
                  sx={{
                    borderInline: 2,
                  }}
                  fullWidth
                >
                  Realizar Pedido
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
