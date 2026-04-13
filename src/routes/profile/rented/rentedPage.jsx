import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Skeleton,
  useMediaQuery,
  useTheme,
  Avatar,
  Stack,
  LinearProgress,
  Badge
} from "@mui/material";
import {
  CalendarToday,
  Store,
  LocalShipping,
  ArrowForward,
  Inventory,
  AttachMoney,
  Schedule,
  CheckCircle,
  Pending,
  LocalActivity,
  LocationOn,
  Receipt,
  Print,
  Share,
  MoreVert,
  ShoppingBag
} from "@mui/icons-material";
import { motion } from "framer-motion";
import rentedServices from "../../../services/rentedServices";

const MotionCard = motion.create(Card);

const STATE_CONFIG = {
  iniciado: {
    color: "warning",
    label: "Iniciado",
    icon: <Pending fontSize="small" />,
    description: "Pedido recibido, pendiente de confirmación"
  },
  confirmado: {
    color: "info",
    label: "Confirmado",
    icon: <CheckCircle fontSize="small" />,
    description: "Pedido confirmado, preparando envío"
  },
  en_camino: {
    color: "primary",
    label: "En Camino",
    icon: <LocalShipping fontSize="small" />,
    description: "Tu pedido está en camino"
  },
  entregado: {
    color: "success",
    label: "Entregado",
    icon: <LocalActivity fontSize="small" />,
    description: "Pedido entregado exitosamente"
  },
  completado: {
    color: "success",
    label: "Completado",
    icon: <CheckCircle fontSize="small" />,
    description: "Alquiler completado"
  },
  cancelado: {
    color: "error",
    label: "Cancelado",
    icon: <Pending fontSize="small" />,
    description: "Pedido cancelado"
  }
};

export default function RentedPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rentedItems, setRentedItems] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadRentedData();
  }, [userId]);

  const loadRentedData = async () => {
    try {
      setLoading(true);
      setError("");
      const rented = await rentedServices.getAllUserRented(userId);
      setRentedItems(rented);
    } catch (err) {
      setError("Error cargando alquileres: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no definida";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewDetails = (rentedId) => {
    navigate(`/my_profile/${userId}/rented/rented_detail/${rentedId}`);
  };

  const handleShare = async (item) => {
    const shareData = {
      title: `Pedido #${item.id.slice(-8)}`,
      text: `Mi pedido de ${item.product?.length || 0} productos por ${formatPrice(item.total)}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const getProgressByState = (state) => {
    const progressMap = {
      iniciado: 25,
      confirmado: 50,
      en_camino: 75,
      entregado: 90,
      completado: 100,
      cancelado: 0
    };
    return progressMap[state] || 0;
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          onClose={() => setError("")}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      borderRadius: 2
    }}>
      {/* Header con estadísticas */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Mis Alquileres
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Gestiona y da seguimiento a tus pedidos de alquiler
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              icon={<ShoppingBag />} 
              label={`${rentedItems.length} pedido${rentedItems.length !== 1 ? 's' : ''}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              icon={<AttachMoney />} 
              label={`Total invertido: ${formatPrice(rentedItems.reduce((sum, item) => sum + (item.total || 0), 0))}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        </Box>
      </Paper>

      {rentedItems.length === 0 ? (
        <Fade in timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              textAlign: "center",
              borderRadius: 3,
              bgcolor: 'white'
            }}
          >
            <Inventory sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="medium">
              No tienes alquileres activos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explora nuestros productos y comienza a alquilar
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/products')}
              startIcon={<ShoppingBag />}
            >
              Explorar Productos
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {rentedItems.map((item, index) => {
            const stateConfig = STATE_CONFIG[item.state] || STATE_CONFIG.iniciado;
            const progress = getProgressByState(item.state);
            const daysRemaining = item.dates?.dateEnd ? 
              getDaysDifference(new Date(), new Date(item.dates.dateEnd)) : 0;

            return (
              <Grid item size={{ xs: 12 }} key={item.id}>
                <Grow in timeout={index * 100}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                      }
                    }}
                    onClick={() => handleViewDetails(item.id)}
                  >
                    {/* Barra de progreso */}
                    {item.state !== 'cancelado' && (
                      <Box sx={{ height: 4, bgcolor: '#e0e0e0' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 4,
                            bgcolor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: stateConfig.color === 'warning' ? '#ff9800' :
                                      stateConfig.color === 'info' ? '#2196f3' :
                                      stateConfig.color === 'primary' ? '#1976d2' :
                                      stateConfig.color === 'success' ? '#4caf50' : '#9e9e9e'
                            }
                          }}
                        />
                      </Box>
                    )}

                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        {/* Información principal */}
                        <Grid item size={{ xs: 12, md: 8 }}>
                          {/* Header del pedido */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                              #{String(item.id).slice(-8).toUpperCase()}
                            </Typography>
                            <Chip 
                              icon={stateConfig.icon}
                              label={stateConfig.label}
                              color={stateConfig.color}
                              size="small"
                              sx={{ fontWeight: 'medium' }}
                            />
                            <Tooltip title={stateConfig.description}>
                              <Typography variant="caption" color="text.secondary">
                                {stateConfig.description}
                              </Typography>
                            </Tooltip>
                          </Box>

                          {/* Detalles del pedido */}
                          <Stack spacing={1.5}>
                            {/* Tienda */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Store sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>Tienda:</strong> {item.store?.name || 'Tienda no especificada'}
                              </Typography>
                            </Box>

                            {/* Fechas */}
                            {item.dates && (
                              <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    <strong>Inicio:</strong> {formatDate(item.dates.dateInit)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    <strong>Devolución:</strong> {formatDate(item.dates.dateEnd)}
                                  </Typography>
                                </Box>
                                {daysRemaining > 0 && item.state !== 'completado' && (
                                  <Chip 
                                    icon={<Schedule />}
                                    label={`${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} restantes`}
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                  />
                                )}
                              </>
                            )}

                            {/* Productos */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalShipping sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                <strong>{item.product?.length || 0} producto{item.product?.length !== 1 ? 's' : ''}</strong>
                              </Typography>
                            </Box>

                            {/* Mostrar primeros productos */}
                            {item.product && item.product.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Productos: {item.product.slice(0, 3).map(p => p.name).join(', ')}
                                  {item.product.length > 3 && ` +${item.product.length - 3} más`}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Grid>

                        {/* Total y acciones */}
                        <Grid item size={{ xs: 12, md: 4 }}>
                          <Box sx={{ 
                            textAlign: { xs: 'left', md: 'right' },
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 2
                          }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Total del pedido
                              </Typography>
                              <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                                {formatPrice(item.total)}
                              </Typography>
                              {item.days && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.days} día{item.days !== 1 ? 's' : ''} de alquiler
                                </Typography>
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                              <Tooltip title="Compartir">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(item);
                                  }}
                                  sx={{ bgcolor: 'action.hover' }}
                                >
                                  <Share fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Imprimir">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.print();
                                  }}
                                  sx={{ bgcolor: 'action.hover' }}
                                >
                                  <Print fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Button
                                variant="contained"
                                endIcon={<ArrowForward />}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(item.id);
                                }}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium'
                                }}
                              >
                                Ver Detalles
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Información adicional para móvil */}
                      {isMobile && item.dates && (
                        <Divider sx={{ my: 2 }} />
                      )}
                    </CardContent>
                  </MotionCard>
                </Grow>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}