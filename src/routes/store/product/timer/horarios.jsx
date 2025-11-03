import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,

} from "@mui/material";
import { AccessTime, Weekend, Schedule } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import TimeSlotEditor from "./timers";
import {
  timerStoreServices,
  getDefaultSchedule,
} from "../../../../services/storeServices";
import TimeEditor from "./timeEditor";



const DayScheduleCard = ({ daySchedule, onChange, index }) => {
  const handleToggle = (enabled) => {
    onChange(index, { ...daySchedule, enabled });
  };

  const handleTimeAmChange = (time_am) => {
    onChange(index, { ...daySchedule, time_am });
  };

  const handleTimePmChange = (time_pm) => {
    onChange(index, { ...daySchedule, time_pm });
  };

  const getDayIcon = (day) => {
    return day === "Domingo" || day === "Sábado" ? <Weekend /> : <Schedule />;
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        border: daySchedule.enabled
          ? "2px solid #4CAF50"
          : "2px solid transparent",
        opacity: daySchedule.enabled ? 1 : 0.7,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getDayIcon(daySchedule.day)}
            <Typography variant="h6" fontWeight="bold">
              {daySchedule.day}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={daySchedule.enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                color="primary"
              />
            }
            label={daySchedule.enabled ? "Activo" : "Inactivo"}
          />
        </Box>

        {daySchedule.enabled && (
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TimeSlotEditor
                timeSlot={daySchedule.time_am}
                onChange={handleTimeAmChange}
                label="Horario Mañana"
                disabled={!daySchedule.enabled}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TimeSlotEditor
                timeSlot={daySchedule.time_pm}
                onChange={handleTimePmChange}
                label="Horario Tarde"
                disabled={!daySchedule.enabled}
              />
            </Grid>
          </Grid>
        )}

        {!daySchedule.enabled && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Día no laborable
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function StoreScheduleEditor() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError("");
      const storeSchedule = await timerStoreServices.getStoreSchedule(id);
      setSchedule(storeSchedule);
      console.log(schedule)
    } catch (err) {
      console.error("Error cargando horario:", err);
      setError("Error cargando horario de la tienda");
      // Cargar horario por defecto en caso de error
      setSchedule(getDefaultSchedule());
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (index, updatedDay) => {
    const newSchedule = [...schedule];
    newSchedule[index] = updatedDay;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await timerStoreServices.updateStoreSchedule(id, schedule);
      setSuccess("Horario guardado correctamente");

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error guardando horario:", err);
      setError("Error guardando horario: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSchedule(getDefaultSchedule());
    setSuccess("");
    setError("");
  };

  const getWorkingDays = () => {
    return schedule.filter((day) => day.enabled).length;
  };

  const getNonWorkingDays = () => {
    return schedule.filter((day) => !day.enabled).map((day) => day.day);
  };

  const getTotalHours = () => {
    let totalMinutes = 0;

    schedule.forEach((day) => {
      if (day.enabled) {
        // Calcular horas de la mañana
        if (day.time_am && day.time_am.length === 2) {
          const [startAM, endAM] = day.time_am;
          if (startAM && endAM) {
            const start = new Date(`2000-01-01T${startAM}`);
            const end = new Date(`2000-01-01T${endAM}`);
            totalMinutes += (end - start) / (1000 * 60);
          }
        }

        // Calcular horas de la tarde
        if (day.time_pm && day.time_pm.length === 2) {
          const [startPM, endPM] = day.time_pm;
          if (startPM && endPM) {
            const start = new Date(`2000-01-01T${startPM}`);
            const end = new Date(`2000-01-01T${endPM}`);
            totalMinutes += (end - start) / (1000 * 60);
          }
        }
      }
    });

    return (totalMinutes / 60).toFixed(1);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 1, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando horario...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          color: "white",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <AccessTime sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Horario de la Tienda
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Configura los horarios de atención para cada día de la semana
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Resumen */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Schedule />
            Resumen del Horario
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item size={{ xs: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Días laborables:
              </Typography>
              <Typography variant="h6" color="primary">
                {getWorkingDays()} días
              </Typography>
            </Grid>
            <Grid item size={{ xs: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Horas semanales:
              </Typography>
              <Typography variant="h6" color="secondary">
                {getTotalHours()} hrs
              </Typography>
            </Grid>
            <Grid item size={{ xs: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Días no laborables:
              </Typography>
              <Typography variant="body2">
                {getNonWorkingDays().join(", ") || "Ninguno"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Editor de horarios */}
      <TimeEditor
        schedule={schedule}
        DayScheduleCard={DayScheduleCard}
        handleDayChange={handleDayChange}
        handleReset={handleReset}
        saving={saving}
        handleSave={handleSave}
      />

      {/* Información adicional */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Nota:</strong> Los cambios se aplicarán inmediatamente después
          de guardar. Los clientes verán estos horarios cuando visiten tu
          tienda.
        </Typography>
      </Alert>
    </Container>
  );
}
