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
} from "@mui/material";
import {
  Person,
  Edit,
  Favorite,  
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Opcion from "./opcions";

// Componente para mostrar ratings con estrellas
const RatingChip = ({ type, count, color }) => (
  <Chip
    icon={<Favorite sx={{ fontSize: 16 }} />}
    label={`${count} ${type}`}
    size="small"
    sx={{
      background: alpha(color, 0.1),
      color: color,
      border: `1px solid ${alpha(color, 0.3)}`,
      fontWeight: "medium",
      "& .MuiChip-icon": { color: color },
    }}
  />
);

export default function Profile() {
  const { user, userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


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

  

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Cargando perfil...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Usuario no encontrado
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
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
    <Box sx={{ my: 2, mx: { xs: 1, md: 3 } }}>
      {/* Header del Perfil */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 3,
          background:
            "linear-gradient(135deg, #FF5733 0%, #FF8C00 50%, #FFD700 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)",
          },
        }}
      >
        <Box position="relative" zIndex={1}>
          <Grid container spacing={3} alignItems="center">
            {/* Avatar Section */}
            <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
              <Avatar
                src={userData?.image}
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  mx: "auto",
                  mb: 2,
                  border: "4px solid",
                  borderColor: "white",
                  boxShadow: 3,
                  bgcolor: alpha("#FFFFFF", 0.2),
                }}
              >
                <Person sx={{ fontSize: { xs: 50, md: 60 } }} />
              </Avatar>

              {/* Stats rápidos */}
            </Grid>

            {/* Información del usuario */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {userData?.nombre || "Usuario"}
              </Typography>

              <Typography
                variant="h6"
                paragraph
                sx={{
                  opacity: 0.9,
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                {userData?.email}
              </Typography>

              {/* Ratings */}
              {userData?.review && (
                <Box
                  sx={{
                    background: alpha("#FFFFFF", 0.2),
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 2,
                    border: "px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <RatingChip
                    type="Excelente"
                    count={userData.review.excellent || 0}
                    color="#4CAF50"
                  />
                  <RatingChip
                    type="Bueno"
                    count={userData.review.good || 0}
                    color="#FF9800"
                  />
                  <RatingChip
                    type="Regular"
                    count={userData.review.average || 0}
                    color="#F44336"
                  />
                </Box>
              )}

              {/* Información adicional */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                
                {userData?.location && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    📍 {userData.location}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Botones de acción */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{ textAlign: { xs: "center", md: "right" } }}
            >
              <Button
                variant="contained"
                startIcon={<Edit />}
                sx={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#FF5733",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    background: "white",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  transition: "all 0.3s ease",
                  mb: 1,
                  width: { xs: "100%", md: "auto" },
                }}
                onClick={() => navigate("edit")}
              >
                Editar Perfil
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Contenido principal */}
      
        <Opcion handleItemClick={handleItemClick}/>
      
    </Box>
  );
}
