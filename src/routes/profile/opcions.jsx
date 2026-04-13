import { Avatar, Container, Box, useTheme, alpha, Card, CardContent, Grid, Typography, Stack, Chip } from '@mui/material';
import React from 'react';
import {
  Favorite,
  People,
  ShoppingCart,
  Store,
  Schedule,
  Badge,
  ArrowForward,
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
    badge: "Gestión",
  },
  {
    id: 2,
    route: "rented",
    primary: "Productos Rentados",
    secondary: "Control y seguimiento de productos en alquiler",
    icon: <Badge />,
    avatarColor: "#9c27b0",
    description: "Gestiona productos rentados",
    badge: "Alquiler",
  },
  {
    id: 3,
    route: "my_cart",
    primary: "Carrito de Compras",
    secondary: "Revisa y gestiona tus pedidos pendientes",
    icon: <ShoppingCart />,
    avatarColor: "#ff5722",
    description: "Administra tu carrito",
    badge: "Compras",
  },
  {
    id: 4,
    route: "services",
    primary: "Mis Servicios",
    secondary: "Gestiona los servicios que ofreces",
    icon: <Store />,
    avatarColor: "#4caf50",
    description: "Control de servicios",
    badge: "Servicios",
  },
  {
    id: 5,
    route: "orders",
    primary: "Mis Pedidos",
    secondary: "Historial y estado de tus pedidos",
    icon: <Schedule />,
    avatarColor: "#ff9800",
    description: "Seguimiento de pedidos",
    badge: "Historial",
  },
  {
    id: 6,
    route: "favorites",
    primary: "Favoritos",
    secondary: "Productos y servicios guardados",
    icon: <Favorite />,
    avatarColor: "#e91e63",
    description: "Tus items favoritos",
    badge: "Guardados",
  },
];

export default function Opcion({ handleItemClick }) {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      {/* Header con diseño más limpio */}
      <Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          Mi Área de Trabajo
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: "600px",
            mx: { xs: "auto", md: 0 },
          }}
        >
          Gestiona todas tus actividades y recursos desde un solo lugar
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {analisisItems.map((item) => (
          <Grid item size={{xs:12, sm:6, lg:4}} key={item.id}>
            <Card
              elevation={0}
              onClick={() => handleItemClick(item.route)}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: theme.palette.background.paper,
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  "& .arrow-icon": {
                    transform: "translateX(4px)",
                    opacity: 1,
                  },
                },
              }}
            >
              {/* Badge decorativo */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 1,
                }}
              >
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    background: alpha(item.avatarColor, 0.1),
                    color: item.avatarColor,
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  {/* Avatar con diseño mejorado */}
                  <Avatar
                    sx={{
                      bgcolor: alpha(item.avatarColor, 0.1),
                      color: item.avatarColor,
                      width: 80,
                      height: 80,
                      mb: 1,
                      transition: "all 0.3s ease",
                      "& .MuiSvgIcon-root": { fontSize: 40 },
                      "&:hover": {
                        transform: "scale(1.05)",
                        bgcolor: alpha(item.avatarColor, 0.15),
                      },
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  {/* Título */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: "1.25rem",
                    }}
                  >
                    {item.primary}
                  </Typography>

                  {/* Descripción */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.5,
                      minHeight: 40,
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Secondary con diseño mejorado */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, 0.04),
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      {item.secondary}
                    </Typography>
                    <ArrowForward 
                      className="arrow-icon"
                      sx={{ 
                        fontSize: 18, 
                        color: theme.palette.primary.main,
                        opacity: 0.6,
                        transition: "all 0.3s ease",
                      }} 
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}