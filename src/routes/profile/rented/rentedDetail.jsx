import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  CalendarToday,
  LocalShipping,
  LocationOn,
  Store,
  AssignmentReturn,
} from "@mui/icons-material";
import rentedServices from "../../../services/rentedServices";
import { useParams } from "react-router-dom";
import { storeService } from "../../../services/storeServices";

// Estados del pedido
const ORDER_STEPS = [
  { label: "Iniciado", key: "iniciado" },
  { label: "Aceptado", key: "aceptado" },
  { label: "Enviado", key: "enviado" },
  { label: "Cerrado", key: "cerrado" },
];

// Estados de los productos
const PRODUCT_STATUS = {
  alquilado: { label: "Alquilado", color: "primary" },
  devuelto: { label: "Devuelto", color: "success" },
  pendiente: { label: "Pendiente", color: "warning" },
};

export default function RentedDetail() {
  const [rentedItem, setRentedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returnDialog, setReturnDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});

  const { userId, rentedId } = useParams();

  useEffect(() => {
    loadRentedData();
  }, [rentedId]);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      const rented = await rentedServices.getRentedDetail(rentedId);
      const store =await storeService.getStoreName(rented.store)

      // Inicializar estados de productos si no existen
      const productsWithStatus = rented.product.map((product) => ({
        ...product,
        status: product.status || "alquilado",
        returnedQuantity: product.returnedQuantity || 0,
      }));

      setRentedItem({
        ...rented,
        product: productsWithStatus,
        store:store
      });

      // Inicializar selecciones para devolución
      const initialSelected = {};
      const initialQuantities = {};
      productsWithStatus.forEach((product) => {
        initialSelected[product.id] = false;
        initialQuantities[product.id] = 0;
      });
      setSelectedProducts(initialSelected);
      setReturnQuantities(initialQuantities);
    } catch (err) {
      setError("Error cargando el alquiler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    const newSelected = {};
    const newQuantities = {};

    rentedItem.product.forEach((product) => {
      newSelected[product.id] = event.target.checked;
      newQuantities[product.id] = event.target.checked
        ? Math.min(
            product.quantity - product.returnedQuantity,
            product.quantity
          )
        : 0;
    });

    setSelectedProducts(newSelected);
    setReturnQuantities(newQuantities);
  };

  const handleProductSelect = (productId, checked) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: checked,
    }));

    if (!checked) {
      setReturnQuantities((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    } else {
      const product = rentedItem.product.find((p) => p.id === productId);
      setReturnQuantities((prev) => ({
        ...prev,
        [productId]: Math.min(
          product.quantity - product.returnedQuantity,
          product.quantity
        ),
      }));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const product = rentedItem.product.find((p) => p.id === productId);
    const maxQuantity = product.quantity - product.returnedQuantity;
    const finalQuantity = Math.min(Math.max(0, quantity), maxQuantity);

    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: finalQuantity,
    }));

    // Auto-seleccionar si la cantidad es mayor a 0
    if (finalQuantity > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: true,
      }));
    }
  };

  const handleReturnProducts = async () => {
    try {
      // Aquí iría la lógica para actualizar el estado de los productos
      console.log("Productos a devolver:", selectedProducts);
      console.log("Cantidades:", returnQuantities);

      // Cerrar diálogo y resetear selecciones
      setReturnDialog(false);
      setSelectedProducts({});
      setReturnQuantities({});

      // Recargar datos
      await loadRentedData();
    } catch (err) {
      setError("Error al procesar la devolución: " + err.message);
    }
  };

  const getActiveStep = () => {
    const stepIndex = ORDER_STEPS.findIndex(
      (step) => step.key === rentedItem?.state
    );
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!rentedItem) {
    return (
      <Box p={3}>
        <Alert severity="warning">No se encontró el alquiler solicitado</Alert>
      </Box>
    );
  }

  const allSelected = rentedItem.product.every(
    (product) => selectedProducts[product.id]
  );
  const someSelected =
    rentedItem.product.some((product) => selectedProducts[product.id]) &&
    !allSelected;

  return (
    <Box sx={{ p: 1, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4" gutterBottom>
          Detalle del Alquiler #{rentedItem.id.slice(-8).toUpperCase()}
        </Typography>
        {/*  <Typography variant="body1" color="text.secondary">
          Estado actual: <Chip 
            label={ORDER_STEPS.find(step => step.key === rentedItem.state)?.label || rentedItem.state} 
            color="primary" 
            size="small" 
          />
        </Typography> */}
      </Box>

      {/* Stepper del estado del pedido */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {ORDER_STEPS.map((step) => (
              <Step key={step.key}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Información del alquiler */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 1 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CalendarToday sx={{ mr: 1, verticalAlign: "bottom" }} />
                Fechas del Alquiler{" "}
                <Badge>
                  <Chip
                    icon={<LocalShipping />}
                    label={`${rentedItem.days} días`}
                    variant="outlined"
                    size="small"
                  />
                </Badge>
              </Typography>
              <Box sx={{ mb: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  Inicio: {formatDate(rentedItem.dates.dateInit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fin: {formatDate(rentedItem.dates.dateEnd)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, md: 4}}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom
              
              sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}>
                <Store sx={{ mr: 1, verticalAlign: "bottom" }} />
                Información de la Tienda
              </Typography>
              <Typography variant="body2">
                {rentedItem.store?.nombre || "Tienda"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                  {rentedItem.store.direccion} - {rentedItem.store.telefono}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          {rentedItem.location && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
                >
                  <LocationOn sx={{ mr: 1, verticalAlign: "bottom" }} />
                  Ubicación de Entrega
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coordenadas guardadas
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      {/* Tabla de productos */}
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Productos Alquilados</Typography>
            <Button
              variant="contained"
              startIcon={<AssignmentReturn />}
              onClick={() => setReturnDialog(true)}
            >
              Devolver Productos
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Precio</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Devuelto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentedItem.product.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            mr: 2,
                            borderRadius: 1,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">${product.price}</TableCell>
                    <TableCell align="center">
                      ${(product.price * product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          PRODUCT_STATUS[product.status]?.label ||
                          product.status
                        }
                        color={
                          PRODUCT_STATUS[product.status]?.color || "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.returnedQuantity || 0}/{product.quantity}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} />
                  <TableCell align="center">
                    <Typography variant="h6" color="primary">
                      Total: ${rentedItem.total}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Diálogo para devolver productos */}
      <Dialog
        open={returnDialog}
        onClose={() => setReturnDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Devolver Productos</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
              />
            }
            label="Seleccionar todos los productos"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ mb: 2 }} />

          {rentedItem.product.map((product) => {
            const availableToReturn =
              product.quantity - (product.returnedQuantity || 0);

            return (
              <Box
                key={product.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedProducts[product.id] || false}
                      onChange={(e) =>
                        handleProductSelect(product.id, e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Disponible para devolver: {availableToReturn} de{" "}
                        {product.quantity}
                      </Typography>
                    </Box>
                  }
                />

                {selectedProducts[product.id] && availableToReturn > 0 && (
                  <Box sx={{ mt: 1, ml: 4 }}>
                    <TextField
                      label="Cantidad a devolver"
                      type="number"
                      size="small"
                      value={returnQuantities[product.id] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: availableToReturn,
                      }}
                      sx={{ width: 120 }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleReturnProducts}
            disabled={
              !Object.values(selectedProducts).some((selected) => selected)
            }
          >
            Confirmar Devolución
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
