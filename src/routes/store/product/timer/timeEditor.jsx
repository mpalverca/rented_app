import { Divider, Paper, Typography, Box, Button,CircularProgress, } from "@mui/material";
import React from "react";
import { Save, Edit} from "@mui/icons-material";
export default function TimeEditor({
  schedule,
  DayScheduleCard,
  handleDayChange,
  handleReset,
  saving,
  handleSave,
  

}) {
    console.log(schedule)
    console.log("dat")
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <Edit />
        Configurar Horarios
      </Typography>

      {schedule.map((daySchedule, index) => (
        <DayScheduleCard
          key={daySchedule.day}
          daySchedule={daySchedule}
          onChange={handleDayChange}
          index={index}
        />
      ))}

      <Divider sx={{ my: 2 }} />
      {/* Vista previa del horario */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vista Previa del Horario
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {schedule.map((day) => (
            <Box
              key={day.day}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {day.day}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {day.enabled ? (
                  <>
                    {day.time_am &&
                      day.time_am[0] &&
                      `${day.time_am[0]} - ${day.time_am[1]}`}
                    {day.time_pm &&
                      day.time_pm[0] &&
                      `, ${day.time_pm[0]} - ${day.time_pm[1]}`}
                    {!day.time_am[0] && !day.time_pm[0] && "Cerrado"}
                  </>
                ) : (
                  "Cerrado"
                )}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
      {/* Botones de acción */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleReset} variant="outlined" disabled={saving}>
          Restablecer
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          //startIcon={saving ? <CircularProgress size={20} /> : <Save />}
         // disabled={saving}
          sx={{
            background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #E64A19 20%, #FBC02D 90%)",
            },
          }}
        >
        {/*saving ? "Guardando..." : "Guardar Horario"*/}
        Guardar Horario
        </Button>
      </Box>
    </Paper>
  );
}
