import { Person, Store, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import rentedServices from "../../../services/rentedServices";

export default function Notes({ rentedItem, setRentedItem, setError, currentUser = "user" }) {
  const [newNote, setNewNote] = useState("");
  const [sendingNote, setSendingNote] = useState(false);
  const theme = useTheme();

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
      
      // Crear nueva nota con tipo "user" (el que envía el mensaje)
      const newNoteObj = {
        id: Date.now().toString(),
        by: "Usuario Actual",
        type: "user", // 'user' o 'store'
        date: new Date().toISOString(),
        note: newNote.trim(),
      };
      await rentedServices.addNoteRented(rentedItem.id, newNoteObj);

      setRentedItem((prev) => ({
        ...prev,
        notes: [...(prev.notes || []), newNoteObj],
      }));

      setNewNote("");
      
      // Simular respuesta de la tienda después de 1 segundo (opcional)
      setTimeout(() => {
        const storeResponse = {
          id: (Date.now() + 1).toString(),
          by: "Tienda",
          type: "store",
          date: new Date().toISOString(),
          note: "Gracias por tu mensaje, te responderemos pronto.",
        };
        setRentedItem((prev) => ({
          ...prev,
          notes: [...(prev.notes || []), storeResponse],
        }));
      }, 1000);
      
    } catch (err) {
      setError("Error al agregar la nota: " + err.message);
    } finally {
      setSendingNote(false);
    }
  };

  // Componente para mensaje individual
  const ChatMessage = ({ note }) => {
    const isUser = note.type === "user";
    
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isUser ? "row-reverse" : "row",
            alignItems: "flex-start",
            gap: 1,
            maxWidth: "80%",
          }}
        >
          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
              width: 40,
              height: 40,
            }}
          >
            {isUser ? <Person /> : <Store />}
          </Avatar>

          {/* Contenido del mensaje */}
          <Box
            sx={{
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                bgcolor: isUser 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.grey[500], 0.1),
                borderRadius: 3,
                borderTopRightRadius: isUser ? 1 : 3,
                borderTopLeftRadius: isUser ? 3 : 1,
                p: 1.5,
                position: "relative",
              }}
            >
              {/* Nombre del remitente */}
              {/* <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  color: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
                  display: "block",
                  mb: 0.5,
                }}
              >
                {note.by}
              </Typography> */}
              
              {/* Mensaje */}
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {note.note}
              </Typography>
            </Box>
            
            {/* Fecha */}
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "block",
                textAlign: isUser ? "right" : "left",
                mt: 0.5,
                mx: 1,
              }}
            >
              {formatDateTime(note.date)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        mt: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          💬 Conversación
        </Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
        {/* Lista de mensajes estilo chat */}
        <Box 
          sx={{ 
            maxHeight: 500, 
            overflow: "auto", 
            p: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          {rentedItem.notes && rentedItem.notes.length > 0 ? (
            <List sx={{ p: 0 }}>
              {rentedItem.notes.map((note) => (
                <ChatMessage key={note.id} note={note} />
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                💬 No hay mensajes aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Envía un mensaje para iniciar la conversación
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input para nuevo mensaje */}
        <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, position: "relative" }}>
  <Grid container spacing={1} alignItems="flex-end">
    <Grid item size={{ xs: 12, sm: 11 }}>
      <TextField
        fullWidth
        multiline
        rows={1}
        maxRows={4}
        variant="outlined"
        placeholder="Escribe tu mensaje..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && newNote.trim() && !sendingNote) {
            e.preventDefault();
            handleAddNote();
          }
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            pr: { xs: 7, sm: 1 }, // Espacio para el botón flotante en móvil
          },
        }}
      />
    </Grid>
    
    {/* Botón flotante para móvil */}
    <Grid item size={{ xs: 12, sm: 1 }}>
      <IconButton
        onClick={handleAddNote}
        disabled={!newNote.trim() || sendingNote}
        sx={{
          position: { xs: "absolute", sm: "relative" },
          bottom: { xs: 20, sm: "auto" },
          right: { xs: 20, sm: "auto" },
          bgcolor: theme.palette.primary.main,
          color: "white",
          width: { xs: 48, sm: "auto" },
          height: { xs: 48, sm: "auto" },
          boxShadow: { xs: 3, sm: 0 },
          "&:hover": {
            bgcolor: theme.palette.primary.dark,
            transform: "scale(1.05)",
          },
        }}
      >
        {sendingNote ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          <Send />
        )}
      </IconButton>
    </Grid>
  </Grid>
</Box>
      </CardContent>
    </Card>
  );
}