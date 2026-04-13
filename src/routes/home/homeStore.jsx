import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Container,
  Divider,
  Paper,
  alpha,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { storeService } from "../../services/storeServices";

export default function Home() {
  const [storeFire, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const subRoutes = ["inventary", "employed", "edit", "timer", "rented", "personal"];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  useEffect(() => {
    if (params.storeId) {
      loadItem();
    }
  }, [params.storeId]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError("");
      const itemData = await storeService.getStoreItemById(params.storeId);
      setStore(itemData);
    } catch (err) {
      console.error("Error cargando item:", err);
      setError("No se pudo cargar la información de la tienda");
    } finally {
      setLoading(false);
    }
  };

  const analisisItems = [
    {
      id: 1,
      route: "inventary",
      primary: "Inventario",
      secondary: "Gestiona todos los productos de alquiler de tu empresa",
      icon: <InventoryIcon />,
      avatarColor: "#1976d2",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Control de stock, precios y disponibilidad",
    },
    {
      id: 2,
      route: "personal",
      primary: "Personal",
      secondary: "Administra el equipo de trabajo de tu tienda",
      icon: <PeopleAltIcon />,
      avatarColor: "#9c27b0",
      badge: "Gestión",
      badgeColor: "primary",
      description: "Empleados, roles y permisos",
    },
    {
      id: 3,
      route: "rented",
      primary: "Pedidos",
      secondary: "Visualiza y gestiona todos los pedidos de alquiler",
      icon: <ShoppingBagIcon />,
      avatarColor: "#d32f2f",
      badge: "Activo",
      badgeColor: "warning",
      description: "Seguimiento de alquileres activos e históricos",
    },
    {
      id: 4,
      route: "tienda",
      primary: "Mi Tienda",
      secondary: "Configura la información de tu negocio",
      icon: <StoreIcon />,
      avatarColor: "#2e7d32",
      badge: "Configuración",
      badgeColor: "info",
      description: "Datos, horarios y políticas de la tienda",
    },
    {
      id: 5,
      route: "timer",
      primary: "Horarios",
      secondary: "Define los horarios de atención y operación",
      icon: <AccessTimeIcon />,
      avatarColor: "#ed6c02",
      badge: "Disponibilidad",
      badgeColor: "warning",
      description: "Horarios para recepción y entrega de material",
    },
  ];

  const handleItemClick = (route) => {
    navigate(route);
  };

  if (isAnalisis) {
    return <Outlet />;
  }

  // Estado de carga
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: "auto" }} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mx: "auto", mt: 1 }} />
          <Skeleton variant="rectangular" width="80%" height={40} sx={{ mx: "auto", mt: 2 }} />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={200} />
          ))}
        </Box>
      </Container>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header mejorado */}
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          mb: 5,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha("#1976d2", 0.05)} 0%, ${alpha("#9c27b0", 0.05)} 100%)`,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 1,
            fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          {storeFire?.nombre || "Mi Tienda"}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "700px",
            mx: "auto",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {storeFire?.descripcion || 
            "Plataforma integral para el control de productos de alquiler para construcción"}
        </Typography>
        
        {/* Información adicional de la tienda */}
        {storeFire && (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", mt: 2 }}>
            {storeFire.category && (
              <Chip 
                label={`📁 ${storeFire.category}`}
                variant="outlined"
                size="small"
              />
            )}
            {storeFire.phone && (
              <Chip 
                label={`📞 ${storeFire.phone}`}
                variant="outlined"
                size="small"
              />
            )}
            {storeFire.email && (
              <Chip 
                label={`✉️ ${storeFire.email}`}
                variant="outlined"
                size="small"
              />
            )}
            {storeFire.isActive !== undefined && (
              <Chip 
                label={storeFire.isActive ? "🟢 Activo" : "🔴 Inactivo"}
                color={storeFire.isActive ? "success" : "default"}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Grid de items */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {analisisItems.map((item) => (
          <Card
            key={item.id}
            elevation={0}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
                borderColor: "primary.main",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => handleItemClick(item.route)}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(item.avatarColor, 0.1),
                    color: item.avatarColor,
                    width: 56,
                    height: 56,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.primary}
                    </Typography>
                    <Chip
                      label={item.badge}
                      color={item.badgeColor}
                      size="small"
                      sx={{ height: 22, fontSize: "0.7rem" }}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.5 }}>
                {item.secondary}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer informativo */}
      {storeFire && (
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} {storeFire.nombre || "Mi Tienda"} • 
            Todos los derechos reservados
          </Typography>
        </Box>
      )}
    </Container>
  );
}