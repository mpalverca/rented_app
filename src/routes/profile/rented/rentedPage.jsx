import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  AvatarGroup,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from "@mui/material";
import {
  CalendarToday,
  Store,
  LocalShipping,
  ArrowForward,
  Inventory
} from "@mui/icons-material";
import rentedServices from "../../../services/rentedServices";

const STATE_COLORS = {
  iniciado: "primary",
  confirmado: "secondary", 
  en_camino: "warning",
  entregado: "info",
  completado: "success"
};

const STATE_LABELS = {
  iniciado: "Iniciado",
  confirmado: "Confirmado",
  en_camino: "En Camino", 
  entregado: "Entregado",
  completado: "Completado"
};

export default function RentedPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rentedItems, setRentedItems] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadRentedData();
  }, [userId]);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      setError("");
      const rented = await rentedServices.getAllUserRented(userId);
      setRentedItems(rented);
      console.log(rented)
    } catch (err) {
      setError("Error cargando alquileres: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const handleViewDetails = (rentedId) => {
    navigate(`/my_profile/${userId}/rented/rented_detail/${rentedId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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

  return (
    <Box sx={{ p: 0,/*  maxWidth: 1200, */ margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Mis Alquileres
      </Typography>

      {rentedItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Inventory sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes alquileres activos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuando realices un alquiler, aparecerá aquí.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rentedItems.map((item) => (
            <Grid item size={{xs:12}} key={item.id}>
              <Card 
                sx={{ 
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3
                  }
                }}
                onClick={() => handleViewDetails(item.id)}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Información principal */}
                    <Grid item size={{xs:12,md:9}}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          Pedido #{item.id.slice(-8).toUpperCase()}
                        </Typography>
                        <Chip 
                          label={STATE_LABELS[item.state] || item.state}
                          color={STATE_COLORS[item.state] || "default"}
                          size="small"
                        />
                      </Box>

                      {/* Información de la tienda */}
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Store fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.store.name}
                        </Typography>
                      </Box>

                      {/* Fechas */}
                      {item.date && (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                          Fecha de alquiler {formatDate(item.date)} 
                          </Typography>
                        </Box>
                      )}

                      {/* Cantidad de productos */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocalShipping fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.length} producto{item.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Grid>
                    {/* Total y acción */}
                    <Grid item size={{xs:12,md:3}}>
                      <Box textAlign={{ xs: "left", md: "right" }}>
                        <Typography variant="h5" color="primary" gutterBottom>
                         Total ${item.total}
                        </Typography>
                        <Button
                          variant="outlined"
                          endIcon={<ArrowForward />}
                          size="small"
                        >
                          Ver Detalles
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Productos en lista (solo nombres) */}
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}