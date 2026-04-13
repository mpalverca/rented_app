import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CalendarToday,
  LocalShipping,
  LocationOn,
  AssignmentReturn,
  CarRentalOutlined,
  Payment,
  Pending,
  CheckCircle,
  LocalActivity,
} from "@mui/icons-material";
import rentedServices from "../../../services/rentedServices";
import { useParams } from "react-router-dom";
import { storeService } from "../../../services/storeServices";
import { DialogCar, ReturnProduct, ViewLocation } from "./dialogRented";
import RentedTable from "./rentedTable";
import Notes from "./Notes";
import { EditDate } from "./dialogDate";
import Head from "../../profile/rented/head";

// Estados del pedido
const ORDER_STEPS = [
  { label: "Iniciado", key: "iniciado", icon: <Pending />, color: "#ff9800" },
  {
    label: "Confirmado",
    key: "confirmado",
    icon: <CheckCircle />,
    color: "#2196f3",
  },
  {
    label: "En Camino",
    key: "en_camino",
    icon: <LocalShipping />,
    color: "#1976d2",
  },
  {
    label: "Entregado",
    key: "entregado",
    icon: <LocalActivity />,
    color: "#4caf50",
  },
  {
    label: "Completado",
    key: "completado",
    icon: <CheckCircle />,
    color: "#4caf50",
  },
];

const STATE_COLORS = {
  iniciado: { bg: "#fff3e0", color: "#ff9800", label: "Iniciado" },
  confirmado: { bg: "#e3f2fd", color: "#2196f3", label: "Confirmado" },
  en_camino: { bg: "#e8eaf6", color: "#1976d2", label: "En Camino" },
  entregado: { bg: "#e8f5e9", color: "#4caf50", label: "Entregado" },
  completado: { bg: "#e8f5e9", color: "#4caf50", label: "Completado" },
  cancelado: { bg: "#ffebee", color: "#f44336", label: "Cancelado" },
};

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleShare = async () => {
    const shareData = {
      title: `Alquiler #${String(rentedItem.id).slice(-8)}`,
      text: `Mi alquiler por ${rentedItem.days} días`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    loadRentedData();
  }, [rentedId]);

  // Cálculo del total - CORREGIDO
 const totalProduct = products.reduce(
  (sum, item) => {
    // Si el producto es extra (sin costo), no lo sumamos
    if (item.extra === true) {
      return sum;
    }
    return sum + (item.subproducto?.price || item.price || 0) * (item.quantity || 0);
  },
  0,
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
            product.quantity,
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
          productItem.quantity,
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
      (step) => step.key === rentedItem?.state,
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
      rentedItem.store.nombre,
    );
    console.log("se ejecuto");
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
      <Head
        rentedItem={rentedItem}
        getActiveStep={getActiveStep}
        isMobile={isMobile}
        ORDER_STEPS={ORDER_STEPS}
        handleShare={handleShare}
        handlePrint={handlePrint}
      />
      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography
          variant="h5"
          sx={{ p: 2, fontWeight: "bold", color: "#333" }}
        >
          Cliente: {rentedItem.clientName}
        </Typography>
      </Paper>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Información del alquiler */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
                borderColor: "#FF5733",
              },
            }}
            onClick={() => setOpenDate(true)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: "#FF5733", fontSize: 24 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Fechas del Alquiler
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<LocalShipping />}
                  label={`${rentedItem.days} días`}
                  size="small"
                  sx={{
                    bgcolor: "#FF5733",
                    color: "white",
                    fontWeight: "bold",
                    mb: 1.5,
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </Box>

              <Box sx={{ spaceY: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", minWidth: 45 }}
                  >
                    📅 Inicio:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", fontWeight: 500 }}
                  >
                    {formatDate(rentedItem.dates.dateInit)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", minWidth: 45 }}
                  >
                    📅 Fin:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", fontWeight: 500 }}
                  >
                    {formatDate(rentedItem.dates.dateEnd)}
                  </Typography>
                </Box>
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
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                  borderColor: "#FF5733",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: "#FF5733", fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Ubicación
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                  }}
                >
                  {rentedItem.reference}
                </Typography>

                <Chip
                  icon={<LocationOn />}
                  label="Ver Mapa"
                  size="small"
                  sx={{
                    border: "1px solid #FF5733",
                    color: "#FF5733",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "rgba(255, 87, 51, 0.05)" },
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
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                  borderColor: "#FF5733",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CarRentalOutlined
                    sx={{ mr: 1, color: "#FF5733", fontSize: 24 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Transporte
                  </Typography>
                </Box>

                <Box sx={{ spaceY: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", minWidth: 55 }}
                    >
                      🚚 Envío:
                    </Typography>
                    <Chip
                      label={
                        rentedItem.carInit.requiere
                          ? "Requerido"
                          : "No requerido"
                      }
                      size="small"
                      sx={{
                        bgcolor: rentedItem.carInit.requiere
                          ? "#FF5733"
                          : "#4CAF50",
                        color: "white",
                        fontSize: "0.7rem",
                        height: 24,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", minWidth: 55 }}
                    >
                      🔄 Retorno:
                    </Typography>
                    <Chip
                      label={
                        rentedItem.carEnd?.requiere
                          ? "Requerido"
                          : "No requerido"
                      }
                      size="small"
                      sx={{
                        bgcolor: rentedItem.carEnd?.requiere
                          ? "#FF5733"
                          : "#4CAF50",
                        color: "white",
                        fontSize: "0.7rem",
                        height: 24,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Pagos */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Payment sx={{ mr: 1, color: "#FF5733", fontSize: 24 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Pagos
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip
                  label={rentedItem.statepay ? "Pagado" : "Sin pagar"}
                  sx={{
                    bgcolor: rentedItem.statepay ? "#4CAF50" : "#FF9800",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label={`Total: $${totalConDias}`}
                  sx={{
                    bgcolor: "#2196F3",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  label={`Pagado: $${rentedItem.payed || 0}`}
                  sx={{
                    bgcolor: rentedItem.statepay ? "#4CAF50" : "#FF9800",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", minWidth: 65 }}
                >
                  Método:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#333", fontWeight: 500 }}
                >
                  {rentedItem.typePay}
                </Typography>
              </Box>
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
        rentedId={rentedId}
        setRentedItem={setRentedItem}
        //setRentedItem={setRentedItem}
      />

      <ViewLocation
        open={mapDialog}
        closeDialog={setMapDialog}
        location={rentedItem.location}
      />
    </Box>
  );
}
