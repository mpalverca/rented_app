import React,{useState} from "react";
import {
  Grid,
  Typography,
  Box,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
export default function RatingDetail({ratingInfo,}) {
   const [expanded, setExpanded] = useState(false);
const ratingDescriptions = {
    good: {
      title: "👍 Bueno",
      description:
        "El producto cumple con lo esperado, en buen estado y funciona correctamente. Recomendado para uso regular.",
      color: "success",
    },
    medium: {
      title: "😐 Regular",
      description:
        "El producto tiene algunos signos de uso pero funciona adecuadamente. Puede tener detalles estéticos menores.",
      color: "warning",
    },
    bad: {
      title: "👎 Malo",
      description:
        "El producto requiere mantenimiento o tiene fallas funcionales. Se recomienda revisión antes del uso.",
      color: "error",
    },
  };

   const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

    return (
    <Grid container spacing={4}>
      {/* Resumen de Rating */}
      <Grid item size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {ratingInfo.icon}
            <Typography variant="h3" sx={{ ml: 1, fontWeight: "bold" }}>
              {ratingInfo.rating.toFixed(1)}
            </Typography>
          </Box>
          <Rating
            value={ratingInfo.rating}
            precision={0.1}
            size="large"
            readOnly
          />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {ratingInfo.sentiment}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Basado en {ratingInfo.totalVotes} opiniones
          </Typography>
        </Paper>

        {/* Desglose de Calificaciones */}
      </Grid>
      <Grid item size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Desglose de Calificaciones
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2">👍 Bueno</Typography>
              <Typography variant="body2" fontWeight="bold">
                {ratingInfo.breakdown.good}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2">😐 Regular</Typography>
              <Typography variant="body2" fontWeight="bold">
                {ratingInfo.breakdown.medium}
              </Typography>
            </Box>

            <Box sx={{ display: "-flex", justifyContent: "space-between" }}>
              <Typography variant="body2">👎 Malo</Typography>
              <Typography variant="body2" fontWeight="bold">
                {ratingInfo.breakdown.bad}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {/* Acordeón de Explicación de Calificaciones */}
      <Grid item size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" gutterBottom>
          ¿Qué significan las calificaciones?
        </Typography>

        {Object.entries(ratingDescriptions).map(([key, desc]) => (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={handleAccordionChange(key)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: `${desc.color}.main`,
                  }}
                >
                  {desc.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {desc.description}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
}
