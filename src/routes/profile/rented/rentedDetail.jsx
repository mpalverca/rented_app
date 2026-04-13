import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Fade,
  Grow,
  Skeleton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  CalendarToday,
  LocalShipping,
  LocationOn,
  Store,
  AssignmentReturn,
  Payment,
  Receipt,
  CheckCircle,
  Pending,
  LocalActivity,
  DirectionsCar,
  MapOutlined,
  Phone,
  Email,
  Print,
  Share,
  ArrowBack,
  VerifiedUser,
  Schedule,
} from "@mui/icons-material";
import rentedServices from "../../../services/rentedServices";
import { useParams, useNavigate } from "react-router-dom";
import { storeService } from "../../../services/storeServices";
import { DialogCar, ReturnProduct, ViewLocation } from "./dialogRented";
import RentedTable from "./rentedTable";
import Notes from "./Notes";
import Head from "./head";

// Configuración de estados del pedido
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

export default function RentedDetail() {
  const [rentedItem, setRentedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returnDialog, setReturnDialog] = useState(false);
  const [mapDialog, setMapDialog] = useState(false);
  const [carview, setCarView] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});

  const { userId, rentedId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    loadRentedData();
  }, [rentedId]);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      const rented = await rentedServices.getRentedDetail(rentedId);
      const store = await storeService.getStoreName(rented.store);

      const productsWithStatus = rented.product.map((product) => ({
        ...product,
        status: product.status || "alquilado",
        returnedQuantity: product.returnedQuantity || 0,
      }));

      setRentedItem({
        ...rented,
        product: productsWithStatus,
        store: store,
      });

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
      const product = rentedItem.product.find((p) => p.id === productId);
      setReturnQuantities((prev) => ({
        ...prev,
        [productId]: Math.min(
          product.quantity - product.returnedQuantity,
          product.quantity,
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

    if (finalQuantity > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: true,
      }));
    }
  };

  const handleReturnProducts = async () => {
    try {
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
    if (!dateString) return "No definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

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

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ mb: 3, borderRadius: 2 }}
        />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rectangular"
                height={150}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!rentedItem) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se encontró el alquiler solicitado</Alert>
      </Box>
    );
  }

  const stateConfig = STATE_COLORS[rentedItem.state] || STATE_COLORS.iniciado;
  const allSelected = rentedItem.product.every(
    (product) => selectedProducts[product.id],
  );
  const someSelected =
    rentedItem.product.some((product) => selectedProducts[product.id]) &&
    !allSelected;

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          borderRadius: 2,
        }}
      >
        {/* Header con gradiente */}
        <Head
          rentedItem={rentedItem}
          getActiveStep={getActiveStep}
          isMobile={isMobile}
          ORDER_STEPS={ORDER_STEPS}
          handleShare={handleShare}
          handlePrint={handlePrint}
        />

        {/* Stepper del estado del pedido */}

        {/* Tarjetas de información */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Fechas */}
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Grow in timeout={300}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CalendarToday sx={{ color: "#667eea" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Fechas
                    </Typography>
                  </Box>
                  <Chip
                    icon={<Schedule />}
                    label={`${rentedItem.days} días`}
                    size="small"
                    sx={{ mb: 2, bgcolor: "#667eea", color: "white" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    📅 Inicio: {formatDate(rentedItem.dates?.dateInit)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 Fin: {formatDate(rentedItem.dates?.dateEnd)}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Tienda */}
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Grow in timeout={400}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Store sx={{ color: "#667eea" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Tienda
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {rentedItem.store?.nombre || "Tienda no especificada"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    📍{" "}
                    {rentedItem.store?.direccion || "Dirección no disponible"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📞 {rentedItem.store?.telefono || "Teléfono no disponible"}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Ubicación */}
          {rentedItem.location && (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Grow in timeout={500}>
                <Card
                  onClick={() => {
                    if (rentedItem.location) {
                      // Extraer coordenadas (soporta array [lat, lng] o objeto {lat, lng})
                      let lat, lng;
                      if (Array.isArray(rentedItem.location)) {
                        lat = rentedItem.location[0];
                        lng = rentedItem.location[1];
                      } else {
                        lat = rentedItem.location.lat;
                        lng = rentedItem.location.lng;
                      }

                      // Abrir Google Maps
                      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                      window.open(googleMapsUrl, "_blank");
                    }
                  }}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                      borderColor: "#667eea",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LocationOn sx={{ color: "#667eea" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Ubicación
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {rentedItem.reference || "Referencia no especificada"}
                    </Typography>
                    <Chip
                      icon={<MapOutlined />}
                      label="Ver en mapa"
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: "#667eea", color: "#667eea" }}
                    />
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          )}

          {/* Transporte */}
          {rentedItem.carInit && (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Grow in timeout={600}>
                <Card
                  onClick={() => setCarView(true)}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <DirectionsCar sx={{ color: "#667eea" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Transporte
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        rentedItem.carInit.requiere
                          ? "Requerido"
                          : "No requerido"
                      }
                      size="small"
                      color={
                        rentedItem.carInit.requiere ? "warning" : "success"
                      }
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Retorno:{" "}
                      {rentedItem.carReturn?.requiere
                        ? "Requerido"
                        : "No requerido"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          )}
        </Grid>

        {/* Tabla de productos */}
        <Card sx={{ borderRadius: 3, mb: 4, overflow: "hidden" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Productos Alquilados
              </Typography>
              <Chip
                icon={<Receipt />}
                label={`Total: ${formatPrice(rentedItem.total)}`}
                sx={{ bgcolor: "#667eea", color: "white", fontWeight: "bold" }}
              />
            </Box>
            <RentedTable
              rentedItem={rentedItem.product}
              days={rentedItem.days}
              total={rentedItem.total}
              AssignmentReturn={AssignmentReturn}
              setReturnDialog={setReturnDialog}
              state={rentedItem?.state}
            />
          </CardContent>
        </Card>

        {/* Sección de Notas/Chat */}
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Notes
              rentedItem={rentedItem}
              setRentedItem={setRentedItem}
              setError={setCarView}
            />
          </CardContent>
        </Card>

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

        <ViewLocation
          open={mapDialog}
          closeDialog={setMapDialog}
          location={rentedItem.location}
        />
      </Box>
    </Fade>
  );
}
