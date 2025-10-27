import React from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TerrainIcon from "@mui/icons-material/Terrain";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { WarningAmberOutlined } from "@mui/icons-material";
import StoreIcon from '@mui/icons-material/Store';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const subRoutes = ["alertmap", "threatmap", "geologia", "fire_camp", "risk"];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  // Datos mejorados con más información
  const analisisItems = [
    {
      id: 1,
      route: "inventario",
      primary: "Inventario",
      secondary:
        "aqui van todos los productos de alquiler que posea tu empresa",
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
      secondary:
        "Es una situación, suceso o hecho que produce alteración en la vida de las personas, de la economía, los sistemas sociales y el ambiente",
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
      secondary:
        "El mapa geológico está diseñado en base a los estudios que se encuentran en los archivos municipales",
      icon: <LocalGroceryStoreIcon/>,
      avatarColor: "#f50404ff",
      badge: "Base de datos",
      badgeColor: "secondary",
      description: "Composición geológica y características del suelo",
    },
     {
      id: 3,
      route: "pedidos",
      primary: "MI Tienda",
      secondary:
        "Gestiona información hacerca de tu tienda",
      icon: <StoreIcon  />,
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
         Alquiler de Material de construcción
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
          Plataforma integral para el Control de Productos de alquiler para construcción
        </Typography>
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
            key={item.id}
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
