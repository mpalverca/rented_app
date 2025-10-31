import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Outlet, useNavigate, useLocation,useParams } from "react-router-dom";
import StoreIcon from '@mui/icons-material/Store';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

import { getStoreItemById } from "../../services/storeServices";

export default function Home() {
  const [storeFire, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const subRoutes = ["inventary", "employed", "edit", "pedidos",];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  useEffect(() => {
    if (params.id) {
      loadItem();
    }
  }, [params.id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const itemData = await getStoreItemById(params.id);
      setStore(itemData);
    } catch (err) {
      console.error('Error cargando item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Datos mejorados con más información - CORREGIDO: IDs únicos
  const analisisItems = [
    {
      id: 1,
      route: "inventary",
      primary: "Inventario",
      secondary: "Aquí van todos los productos de alquiler que posea tu empresa",
      icon: <EditNoteIcon />,
      avatarColor: "#2196f3",
      badge: "Actualizado",
      badgeColor: "success",
      description: "Registro histórico de afectaciones por eventos naturales",
    },
    {
      id: 2,
      route: "personal",
      primary: "Personal",
      secondary: "Es una situación, suceso o hecho que produce alteración en la vida de las personas, de la economía, los sistemas sociales y el ambiente",
      icon: <PeopleAltIcon />,
      avatarColor: "#9c27b0",
      badge: "Nuevo",
      badgeColor: "primary",
      description: "Evaluación de áreas con mayor propensión a riesgos",
    },
    {
      id: 3,
      route: "pedidos",
      primary: "Pedidos",
      secondary: "El mapa geológico está diseñado en base a los estudios que se encuentran en los archivos municipales",
      icon: <LocalGroceryStoreIcon />,
      avatarColor: "#f50404ff",
      badge: "Base de datos",
      badgeColor: "secondary",
      description: "Composición geológica y características del suelo",
    },
    {
      id: 4, // CAMBIADO: ID único
      route: "tienda",
      primary: "MI Tienda",
      secondary: "Gestiona información acerca de tu tienda",
      icon: <StoreIcon />,
      avatarColor: "#4caf50",
      badge: "Base de datos",
      badgeColor: "secondary",
      description: "Composición geológica y características del suelo",
    },
  ];

  const handleItemClick = (route) => {
    navigate(route);
  };

  if (isAnalisis) {
    return <Outlet />;
  }

  return (
    <Box sx={{ p: 1, minHeight: "80vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 1,
          }}
        >
          {loading ? "Cargando..." : (storeFire?.nombre || "Mi Tienda")}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {storeFire?.descripcion || "Plataforma integral para el Control de Productos de alquiler para construcción"}
        </Typography>
        
        {/* Mostrar información adicional del store si existe */}
        {storeFire && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`Categoría: ${storeFire.category || 'Sin categoría'}`} 
              variant="outlined" 
              sx={{ mr: 1 }} 
            />
            {storeFire.isActive !== undefined && (
              <Chip 
                label={storeFire.isActive ? 'Activo' : 'Inactivo'} 
                color={storeFire.isActive ? 'success' : 'default'}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Grid de items */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
          maxWidth: "1300px",
          mx: "auto",
        }}
      >
        {analisisItems.map((item) => (
          <Card
            key={item.id} // AHORA TODOS LOS IDs SON ÚNICOS
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
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
                    bgcolor: item.avatarColor,
                    width: 60,
                    height: 60,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
                      {item.primary}
                    </Typography>
                    <Chip
                      label={item.badge}
                      color={item.badgeColor}
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                {item.secondary}
              </Typography>              
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer informativo */}
    </Box>
  );
}