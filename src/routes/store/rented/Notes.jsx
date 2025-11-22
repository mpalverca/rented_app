import { Person, Send, ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  Collapse,
  CardHeader,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";

export default function Notes({ rentedItem, setRentedItem, setError }) {
  const [newNote, setNewNote] = useState("");
  const [sendingNote, setSendingNote] = useState(false);
  const [expanded, setExpanded] = useState(false); // Estado para el colapsable

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setSendingNote(true);
      // Aquí iría la llamada al servicio para agregar la nota
      // await rentedServices.addNote(rentedId, newNote);
      
      // Simulación de agregar nota
      const newNoteObj = {
        id: Date.now().toString(),
        user: "Usuario Actual", // En una app real, esto vendría del contexto de autenticación
        date: new Date().toISOString(),
        note: newNote.trim()
      };

      setRentedItem(prev => ({
        ...prev,
        notes: [...(prev.notes || []), newNoteObj]
      }));

      setNewNote("");
    } catch (err) {
      setError("Error al agregar la nota: " + err.message);
    } finally {
      setSendingNote(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        pb:5,
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header clickeable del colapsable */}
      <CardHeader
        onClick={toggleExpanded}
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(255, 87, 51, 0.9)",
          },
        }}
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            💬 Comentarios y Notas
          </Typography>
        }
        action={
          <IconButton 
            onClick={toggleExpanded} 
            sx={{ color: "white" }}
            aria-label={expanded ? "Contraer" : "Expandir"}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />

      {/* Contenido colapsable */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 0 }}>
          {/* Lista de notas existentes */}
          <Box sx={{ maxHeight: 400, overflow: "auto", p: 2 }}>
            {rentedItem.notes && rentedItem.notes.length > 0 ? (
              <List>
                {rentedItem.notes.map((note, index) => (
                  <React.Fragment key={note.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#FF5733" }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold">
                              {note.by}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDateTime(note.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 0.5 }}
                          >
                            {note.note}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < rentedItem.notes.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay comentarios aún. Sé el primero en agregar una nota.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Input para nueva nota */}
          
            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
  <TextField
    fullWidth
    multiline
    rows={2}
    maxRows={4}
    variant="outlined"
    placeholder="Escribe un comentario o nota..."
    value={newNote}
    onChange={(e) => setNewNote(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddNote();
      }
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={handleAddNote}
            disabled={!newNote.trim() || sendingNote}
            sx={{
              backgroundColor: "#FF5733",
              color: "white",
              "&:hover": {
                backgroundColor: "#E04E2E",
              },
              "&:disabled": {
                backgroundColor: "grey.300",
              },
              alignSelf: "flex-end", // Alinea el botón al final
              mb: 0.5, // Pequeño margen inferior
            }}
            size="small"
          >
            <Send />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        paddingRight: 1, // Espacio para el botón
        alignItems: "flex-start", // Alinea el contenido al inicio
      },
    }}
  />
  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
    Presiona Enter para enviar, Shift+Enter para nueva línea
  </Typography>
</Box>
       
        </CardContent>
      </Collapse>
    </Card>
  );
}