import {

  Box,
 
  Button,

  Dialog,
  DialogContent,
  DialogTitle,

  DialogActions,

  Typography,
 
  Grid,
 
  CircularProgress,
 
  Alert,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { timerStoreServices } from "../../../services/storeServices";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

export const EditDate = ({ open, handleCloseDialog, dates, days, store, onDateUpdate,state }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [storeSchedule, setStoreSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
console.log(store)
  // Cargar el horario de la tienda
  useEffect(() => {
    const loadStoreSchedule = async () => {
      if (store) {
        try {
          setLoading(true);
          const schedule = await timerStoreServices.getStoreSchedule(store.id);
          console.log(schedule)
          setStoreSchedule(schedule);
        } catch (err) {
          setError("Error cargando horario de la tienda");
          console.error("Error loading store schedule:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      loadStoreSchedule();
    }
  }, [store, open]);

  // Inicializar fechas cuando se abra el diálogo
  useEffect(() => {
    if (open && dates) {
      const initStartDate = new Date(dates.dateInit);
      const initEndDate = new Date(dates.dateEnd);
      
      setStartDate(initStartDate);
      setEndDate(initEndDate);
      
      // Calcular días iniciales
      const diffTime = Math.abs(initEndDate - initStartDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCalculatedDays(diffDays);
    }
  }, [open, dates]);

  // Calcular días cuando cambien las fechas
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCalculatedDays(diffDays);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    // Si la fecha de inicio es después de la fecha fin, ajustar fecha fin
    if (endDate && newDate > endDate) {
      setEndDate(newDate);
    }
  };

  const handleEndDateChange = (newDate) => {
    if (startDate && newDate < startDate) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }
    setEndDate(newDate);
    setError("");
  };

  const handleSave = () => {
    if (!startDate || !endDate) {
      setError("Ambas fechas son requeridas");
      return;
    }

    if (startDate > endDate) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin");
      return;
    }

    // Formatear fechas para enviar
    const updatedDates = {
      dateInit: startDate.toISOString(),
      dateEnd: endDate.toISOString(),
    };

    // Llamar callback para actualizar en el componente padre
    if (onDateUpdate) {
      onDateUpdate(updatedDates, calculatedDays);
    }

    handleCloseDialog();
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Editar Fechas del Alquiler
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Información del horario de la tienda */}
          {/* Información del horario de la tienda - Versión con chips */}
{storeSchedule && storeSchedule.length > 0 && (
  <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
      📅 Horario de la Tienda
    </Typography>
    
    <Grid container spacing={1}>
      {storeSchedule
        .filter(day => day.enabled)
        .map((daySchedule, index) => (
          <Grid item size={{xs:12, sm:6, md:4 }}key={daySchedule.day || index}>
            <Box 
              sx={{ 
                p: 1, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="primary.main">
                {daySchedule.day}
              </Typography>
              
              {daySchedule.time_am && daySchedule.time_am.length === 2 && (
                <Typography variant="caption" display="block">
                  🌅 {daySchedule.time_am[0]} - {daySchedule.time_am[1]}
                </Typography>
              )}
              
              {daySchedule.time_pm && daySchedule.time_pm.length === 2 && (
                <Typography variant="caption" display="block">
                  🌇 {daySchedule.time_pm[0]} - {daySchedule.time_pm[1]}
                </Typography>
              )}
              
              {(!daySchedule.time_am && !daySchedule.time_pm) && (
                <Typography variant="caption" color="text.secondary">
                  ❌ Cerrado
                </Typography>
              )}
            </Box>
          </Grid>
        ))
      }
    </Grid>

    {/* Resumen de disponibilidad */}
    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="caption" color="success.main" fontWeight="medium">
        ✅ {storeSchedule.filter(day => day.enabled).length} días disponibles
      </Typography>
      {storeSchedule.some(day => !day.enabled) && (
        <Typography variant="caption" color="text.secondary">
          ❌ {storeSchedule.filter(day => !day.enabled).length} días no disponibles
        </Typography>
      )}
    </Box>
  </Box>
)}

          <Grid container spacing={3}>
            {/* Fecha de Inicio */}
            <Grid item size={{xs:12, md:6}}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={handleStartDateChange}
                format="dd/MM/yyyy"
                minDate={new Date()} // No permitir fechas pasadas
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error && error.includes("inicio")
                  }
                }}
              />
              {startDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Seleccionado: {formatDate(startDate)}
                </Typography>
              )}
            </Grid>

            {/* Fecha de Fin */}
            <Grid item size={{xs:12, md:6}}>
              <DatePicker
                label="Fecha de Fin"
                value={endDate}
                onChange={handleEndDateChange}
                format="dd/MM/yyyy"
                minDate={startDate || new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error && error.includes("fin")
                  }
                }}
              />
              {endDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Seleccionado: {formatDate(endDate)}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Resumen de días */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Días anteriores:
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {days} días
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">
                  Nuevos días:
                </Typography>
                <Typography 
                  variant="h6" 
                  color={calculatedDays !== days ? "primary.main" : "text.primary"}
                  fontWeight="bold"
                >
                  {calculatedDays} días
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Información adicional */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              💡 Las fechas determinarán la duración total del alquiler
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: "#FF5733",
              color: "#FF5733",
              "&:hover": {
                borderColor: "#E04E2E",
                backgroundColor: "rgba(255, 87, 51, 0.04)",
              },
            }}
          >
            Cancelar
          </Button>
          {state=="aceptado"?<Button
            onClick={handleSave}
            variant="contained"
            disabled={!startDate || !endDate || calculatedDays === 0}
            sx={{
              background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
              color: "white",
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                background: "linear-gradient(45deg, #E04E2E 30%, #E6C200 90%)",
                boxShadow: 3,
              },
              "&:disabled": {
                background: "grey.300",
              },
            }}
          >
            Guardar Fechas
          </Button>:<></>}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};