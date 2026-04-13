import React, { useEffect, useState } from "react";
import rentedServices from "../../../services/rentedServices";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Typography,
  Button,
  TextField,
  InputAdornment
} from "@mui/material";
import { ArrowForward, CalendarToday, Inventory, LocalShipping, Store, Search, Clear } from "@mui/icons-material";

const STATE_COLORS = {
  iniciado: "primary",
  confirmado: "secondary", 
  en_camino: "warning",
  entregado: "info",
  completado: "success"
};

const STATE_LABELS = {
  iniciado: "Iniciado",
  aceptado: "Aceptado",
  enviado: "Eviado", 
  entregado: "Entregado",
  completado: "Completado"
};

export default function RentedStore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rentedItems, setRentedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const { storeId } = useParams();

  useEffect(() => {
    loadRentedData();
  }, [storeId]);

  // Filtrar items cuando cambie searchTerm o rentedItems
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(rentedItems);
    } else {
      const filtered = rentedItems.filter(item =>
        item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client?.ci?.toString().toLowerCase().includes(searchTerm.toLowerCase())||
        STATE_LABELS[item.state]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.total?.toString().includes(searchTerm)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, rentedItems]);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      const rented = await rentedServices.getAllStoreRented(storeId);
      setRentedItems(rented);
      setFilteredItems(rented); // Inicializar filteredItems
    } catch (err) {
      setError("Error cargando el carrito: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const handleViewDetails = (rentedId) => {
    navigate(`/my_store/${storeId}/rented/rented_detail/${rentedId}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Mis Alquileres
      </Typography>

      {/* Barra de búsqueda */}
      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por ID, cliente, cédula, estado o total..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Clear fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        
        {/* Información de resultados */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} de {rentedItems.length} alquileres encontrados
          </Typography>
          {searchTerm && (
            <Typography variant="caption" color="primary">
              Buscando: "{searchTerm}"
            </Typography>
          )}
        </Box>
      </Card>

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
      ) : filteredItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Search sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron alquileres
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No hay resultados para "{searchTerm}"
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleClearSearch}
            sx={{ mt: 2 }}
          >
            Limpiar búsqueda
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item size={{ xs: 12 }} key={item.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleViewDetails(item.id)}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Información principal */}
                    <Grid item size={{ xs: 12, md: 9 }}>
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
                          {item.client.name}-{item.client.ci}-agrega el ratting aqui
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
                          {item.length} producto{item.length !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Grid>
                    {/* Total y acción */}
                    <Grid item size={{ xs: 12, md: 3 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}