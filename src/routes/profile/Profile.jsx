import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Box,
  Chip,
  alpha,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Person,
  Edit,
  Favorite,
  Email,
  LocationOn,
  Phone,
  CalendarToday,
  Settings,
  ExitToApp,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Opcion from "./opcions";

// Componente para mostrar ratings con estrellas mejorado
const RatingChip = ({ type, count, color }) => (
  <Chip
    icon={<Favorite sx={{ fontSize: 14 }} />}
    label={`${count} ${type}`}
    size="small"
    sx={{
      background: alpha(color, 0.08),
      color: color,
      border: `1px solid ${alpha(color, 0.2)}`,
      fontWeight: 500,
      fontSize: "0.75rem",
      "& .MuiChip-icon": { 
        color: color,
        fontSize: 14,
      },
    }}
  />
);

// Componente de información del usuario
const InfoField = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value || "No especificado"}
    </Typography>
  </Box>
);

export default function Profile() {
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const subRoutes = [
    "partners",
    "rented",
    "my_cart",
    "services",
    "edit",
    "timer",
  ];
  const isAnalisis = subRoutes.some((route) =>
    location.pathname.includes(route)
  );

  const handleItemClick = (route) => {
    navigate(route);
  };

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      await logout();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Cargando perfil...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Usuario no encontrado
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  if (isAnalisis) {
    return <Outlet />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header simplificado */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: theme.palette.background.paper,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Avatar Section */}
            <Grid item size={{xs:12, md:3}} sx={{ textAlign: "center" }}>
              <Avatar
                src={userData?.image}
                sx={{
                  width: { xs: 100, md: 130 },
                  height: { xs: 100, md: 130 },
                  mx: "auto",
                  mb: 2,
                  border: `3px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Person sx={{ fontSize: { xs: 50, md: 65 } }} />
              </Avatar>
              
              {userData?.review && (
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                  <RatingChip
                    type="Excelente"
                    count={userData.review.excellent || 0}
                    color={theme.palette.success.main}
                  />
                  <RatingChip
                    type="Bueno"
                    count={userData.review.good || 0}
                    color={theme.palette.warning.main}
                  />
                  <RatingChip
                    type="Regular"
                    count={userData.review.average || 0}
                    color={theme.palette.error.main}
                  />
                </Stack>
              )}
            </Grid>

            {/* Información del usuario */}
            <Grid item size={{xs:12, md:6}}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: "1.75rem", md: "2rem" },
                  color: theme.palette.text.primary,
                }}
              >
                {userData?.nombre || "Usuario"}
              </Typography>

              <Typography
                variant="body1"
                gutterBottom
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 2,
                }}
              >
                {userData?.email}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Información detallada */}
              <Stack spacing={1.5}>
                {userData?.phone && (
                  <InfoField 
                    icon={<Phone fontSize="small" color="action" />}
                    label="Teléfono"
                    value={userData.phone}
                  />
                )}
                {userData?.location && (
                  <InfoField 
                    icon={<LocationOn fontSize="small" color="action" />}
                    label="Ubicación"
                    value={userData.location}
                  />
                )}
                {userData?.memberSince && (
                  <InfoField 
                    icon={<CalendarToday fontSize="small" color="action" />}
                    label="Miembro desde"
                    value={userData.memberSince}
                  />
                )}
              </Stack>
            </Grid>

            {/* Botones de acción */}
            <Grid item size={{xs:12, md:3}}>
              <Stack spacing={1.5} direction={{ xs: "row", md: "column" }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate("edit")}
                >
                  Editar Perfil
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  fullWidth
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: theme.palette.error.main,
                    borderColor: alpha(theme.palette.error.main, 0.5),
                    "&:hover": {
                      borderColor: theme.palette.error.main,
                      backgroundColor: alpha(theme.palette.error.main, 0.04),
                    },
                  }}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Contenido principal - Opciones */}
      <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Opcion handleItemClick={handleItemClick} />
        </CardContent>
      </Card>
    </Container>
  );
}