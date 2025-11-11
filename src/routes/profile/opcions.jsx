import { Avatar, Container,Box, useTheme,
  alpha,Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import {
  
  Favorite,
  People,
  ShoppingCart,
  Store,
  Schedule,
  Badge,
} from "@mui/icons-material";
// Datos mejorados para el e-commerce
const analisisItems = [
  {
    id: 1,
    route: "partners",
    primary: "Socios y Colaboradores",
    secondary: "Gestiona tus relaciones comerciales y colaboradores",
    icon: <People />,
    avatarColor: "#2196f3",
    description: "Administra socios y colaboradores",
  },
  {
    id: 2,
    route: "rented",
    primary: "Productos Rentados",
    secondary: "Control y seguimiento de productos en alquiler",
    icon: <Badge />,
    avatarColor: "#9c27b0",
    description: "Gestiona productos rentados",
  },
  {
    id: 3,
    route: "my_cart",
    primary: "Carrito de Compras",
    secondary: "Revisa y gestiona tus pedidos pendientes",
    icon: <ShoppingCart />,
    avatarColor: "#ff5722",
    description: "Administra tu carrito",
  },
  {
    id: 4,
    route: "services",
    primary: "Mis Servicios",
    secondary: "Gestiona los servicios que ofreces",
    icon: <Store />,
    avatarColor: "#4caf50",
    description: "Control de servicios",
  },
  {
    id: 5,
    route: "orders",
    primary: "Mis Pedidos",
    secondary: "Historial y estado de tus pedidos",
    icon: <Schedule />,
    avatarColor: "#ff9800",
    description: "Seguimiento de pedidos",
  },
  {
    id: 6,
    route: "favorites",
    primary: "Favoritos",
    secondary: "Productos y servicios guardados",
    icon: <Favorite />,
    avatarColor: "#e91e63",
    description: "Tus items favoritos",
  },
];

export default function Opcion({handleItemClick}) {
  const theme = useTheme();
    // Estilos reutilizables
      const gradientStyle = {
        background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: "bold",
      };
    
      const borderGradientStyle = {
        border: "2px solid transparent",
        background:
          "linear-gradient(white, white) padding-box, linear-gradient(45deg, #FF5733 20%, #FFD700 90%) border-box",
      };
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
          <Typography
            variant="h5"
            sx={{
              ...gradientStyle,
              mb: 3,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Mi Área de Trabajo
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {analisisItems.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={item.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    ...borderGradientStyle,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                    height: "100%",
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                  onClick={() => handleItemClick(item.route)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3, textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: item.avatarColor,
                          width: 70,
                          height: 70,
                          mb: 2,
                          "& .MuiSvgIcon-root": { fontSize: 32 },
                        }}
                      >
                        {item.icon}
                      </Avatar>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          color: "text.primary",
                        }}
                      >
                        {item.primary}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          minHeight: 40,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          fontStyle: "italic",
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          p: 1.5,
                          borderRadius: 2,
                          width: "100%",
                        }}
                      >
                        {item.secondary}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
  );
}
