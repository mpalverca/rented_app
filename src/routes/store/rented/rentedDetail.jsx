import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  CalendarToday,
  LocalShipping,
  LocationOn,
  AssignmentReturn,
  CarRentalOutlined,
  Payment,
} from "@mui/icons-material";
import rentedServices from "../../../services/rentedServices";
import { useParams } from "react-router-dom";
import { storeService } from "../../../services/storeServices";
import { DialogCar, ReturnProduct, ViewLocation } from "./dialogRented";
import RentedTable from "./rentedTable";
import Notes from "./Notes";
import { EditDate } from "./dialogDate";

// Estados del pedido
const ORDER_STEPS = [
  { label: "Iniciado", key: "iniciado" },
  { label: "Aceptado", key: "aceptado" },
  { label: "Enviado", key: "enviado" },
  { label: "Retorno", key: "retorno" },
  { label: "Cerrado", key: "cerrado" },
];

export default function RentedDetailStore() {
  const [rentedItem, setRentedItem] = useState(null);
  const [products, setProducts] = useState([]); // Cambié el nombre a products para evitar conflicto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returnDialog, setReturnDialog] = useState(false);
  const [mapDialog, setMapDialog] = useState(false);
  const [carview, setCarView] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});
  const [openDate, setOpenDate] = useState(false);
  const { userId, rentedId } = useParams();

  useEffect(() => {
    loadRentedData();
  }, [rentedId]);

  // Cálculo del total - CORREGIDO
  const totalProduct = products.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const total =
    rentedItem?.total === totalProduct ? rentedItem?.total : totalProduct;
  const totalConDias = total * (rentedItem?.days || 1);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      const rented = await rentedServices.getRentedDetail(rentedId);
      const store = await storeService.getStoreName(rented.store);
      console.log(rented);

      const productsWithStatus = rented.product.map((product) => ({
        ...product,
        status: product.status || "alquilado",
        returnedQuantity: product.returnedQuantity || 0,
      }));

      setRentedItem({
        ...rented,
        store: store,
      });
      setProducts(productsWithStatus); // Cambié a setProducts

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
  const handleCloseDate = () => {
    setOpenDate(false);
  };
  const handleSelectAll = (event) => {
    const newSelected = {};
    const newQuantities = {};

    products.forEach((product) => {
      // Cambié a products
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
      const productItem = products.find((p) => p.id === productId); // Cambié el nombre para evitar conflicto
      setReturnQuantities((prev) => ({
        ...prev,
        [productId]: Math.min(
          productItem.quantity - productItem.returnedQuantity,
          productItem.quantity
        ),
      }));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const productItem = products.find((p) => p.id === productId); // Cambié el nombre para evitar conflicto
    const maxQuantity = productItem.quantity - productItem.returnedQuantity;
    const finalQuantity = Math.min(Math.max(0, quantity), maxQuantity);

    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: finalQuantity,
    }));

    if (finalQuantity > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: true,
      }));
    }
  };

  const handleReturnProducts = async () => {
    try {
      console.log("Productos a devolver:", selectedProducts);
      console.log("Cantidades:", returnQuantities);
      setReturnDialog(false);
      setSelectedProducts({});
      setReturnQuantities({});
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

  const handlechangeAcept = async () => {
    await rentedServices.acceptRented(
      rentedId,
      products,
      rentedItem.store.nombre
    );
    console.log("se ejecuto")
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

  const allSelected = products.every((product) => selectedProducts[product.id]); // Cambié a products
  const someSelected =
    products.some((product) => selectedProducts[product.id]) && !allSelected; // Cambié a products

  return (
    <Box sx={{ p: 1, margin: "0 auto" }}>
      {/* Header con gradiente */}
      <Box
        sx={{
          mb: 3,
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          p: 3, // Agregué padding para mejor visualización
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Detalle del Alquiler #{rentedItem.id.slice(-8).toUpperCase()}
        </Typography>
      </Box>

      {/* Stepper del estado del pedido */}
      <Card
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {ORDER_STEPS.map((step) => (
              <Step key={step.key}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {/* Información del alquiler */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "80%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
            onClick={() => setOpenDate(true)}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignContent: "space-around",
                  alignItems: "center",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                <CalendarToday sx={{ mr: 1 }} />
                Fechas del Alquiler
              </Typography>
              <Chip
                icon={<LocalShipping />}
                label={`${rentedItem.days} días`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#FF5733",
                  color: "#FF5733",
                  fontWeight: "bold",
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  📅 Inicio: {formatDate(rentedItem.dates.dateInit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 Fin: {formatDate(rentedItem.dates.dateEnd)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ubicación de Entrega */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          {rentedItem.location && (
            <Card
              onClick={() => setMapDialog(true)}
              sx={{
                height: "80%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                  borderColor: "#FF5733",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  <LocationOn sx={{ mr: 1 }} />
                  Ubicación
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  //sx={{ mb: 1 }}
                >
                  {rentedItem.reference}
                </Typography>
                <Chip
                  icon={<LocationOn />}
                  label="Ver Mapa"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "#FF5733",
                    color: "#FF5733",
                  }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Transporte */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          {rentedItem.carInit && (
            <Card
              onClick={() => setCarView(true)}
              sx={{
                height: "80%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                  borderColor: "#FF5733",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  <CarRentalOutlined sx={{ mr: 1 }} />
                  Transporte
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  🚚 Envío:{" "}
                  {rentedItem.carInit.requiere ? "Requerido" : "No requerido"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🔄 Retorno:{" "}
                  {rentedItem.carEnd?.requiere ? "Requerido" : "No requerido"}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Pagos */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "80%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                <Payment sx={{ mr: 1 }} />
                Pagos
              </Typography>
              <Chip
                label={rentedItem.statepay ? "Pagado" : "Sin pagar"}
                color={rentedItem.statepay ? "success" : "warning"}
                variant="outlined"
                sx={{ mb: 1, fontWeight: "bold" }}
              />
              <Chip
                label={`Total: $${totalConDias}`}
                color="primary"
                variant="outlined"
                sx={{ mb: 1, fontWeight: "bold" }}
              />
              <Chip
                label={`Pagado: $${rentedItem.payed || 0}`}
                color={rentedItem.statepay ? "success" : "warning"}
                variant="outlined"
                sx={{ mb: 1, fontWeight: "bold" }}
              />
              <Typography variant="body2" color="text.secondary">
                Método: {rentedItem.typePay}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de productos */}
      <RentedTable
        setProduct={setProducts} // Cambié a setProducts
        rentedItem={products} // Cambié a products
        total={total}
        AssignmentReturn={AssignmentReturn}
        setReturnDialog={setReturnDialog}
        state={rentedItem?.state}
        days={rentedItem?.days}
        accept={handlechangeAcept}
      />

      {/* Sección de Notas/Chat */}
      <Notes
        rentedItem={rentedItem}
        setRentedItem={setRentedItem}
        setError={setError} // Corregí esto - estaba setCarView
      />

      {/* Diálogos */}
      <ReturnProduct
        returnDialog={returnDialog}
        allSelected={allSelected}
        someSelected={someSelected}
        handleSelectAll={handleSelectAll}
        setReturnDialog={setReturnDialog}
        rentedItem={rentedItem}
        selectedProducts={selectedProducts}
        returnQuantities={returnQuantities}
        handleProductSelect={handleProductSelect}
        handleQuantityChange={handleQuantityChange}
        handleReturnProducts={handleReturnProducts}
      />

      <DialogCar
        open={carview}
        setReturnDialog={setCarView}
        title="Vehículos de Transporte"
        carI={rentedItem.carInit}
        carR={rentedItem.carReturn}
      />

      <EditDate
        open={openDate}
        handleCloseDialog={handleCloseDate}
        dates={rentedItem.dates}
        days={rentedItem.days}
        store={rentedItem.store}
        state={rentedItem.state}
      />

      <ViewLocation
        open={mapDialog}
        closeDialog={setMapDialog}
        location={rentedItem.location}
      />
    </Box>
  );
}
