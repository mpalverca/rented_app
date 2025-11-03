import React, { useState, useEffect } from "react";
import { 
  Typography,
  Grid,
  Box,  
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AccessTime, Edit } from "@mui/icons-material";

const TimeSlotEditor = ({ timeSlot, onChange, label, disabled }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(timeSlot[0] || "08:00");
  const [endTime, setEndTime] = useState(timeSlot[1] || "12:00");

  const handleSave = () => {
    if (startTime && endTime) {
      onChange([startTime, endTime]);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setStartTime(timeSlot[0] || "08:00");
    setEndTime(timeSlot[1] || "12:00");
    setOpen(false);
  };

  const formatTimeDisplay = () => {
    if (!timeSlot || timeSlot.length < 2) return "No configurado";
    return `${timeSlot[0]} - ${timeSlot[1]}`;
  };

  return (
    <>
      <Box sx={{ mb: 0 }}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<AccessTime />}
            label={formatTimeDisplay()}
            onClick={() => !disabled && setOpen(true)}
            color={timeSlot && timeSlot.length === 2 ? "primary" : "default"}
            variant={disabled ? "outlined" : "filled"}
            sx={{
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          />
          {!disabled && (
            <IconButton
              size="small"
              onClick={() => setOpen(true)}
              color="primary"
            >
              <Edit />
            </IconButton>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime />
            Editar {label}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Hora inicio"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item size={{ xs: 6 }}>
              <TextField
                label="Hora fin"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!startTime || !endTime}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default TimeSlotEditor