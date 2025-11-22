import React, { useEffect, useState } from 'react'
import { storeService } from '../services/storeServices'
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Store as StoreIcon } from "@mui/icons-material";
import StoreCard from '../components/store/storeCard';
import { useNavigate } from 'react-router-dom';

export default function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
const navigate = useNavigate()
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const dataview = await storeService.getAllStores()
      setStores(dataview)
    } catch (err) {
      setError("Error cargando las tiendas: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar tiendas basado en la búsqueda
  const filteredStores = stores.filter(store =>
    store.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con gradiente */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          p: 1,
          mb: 1
        }}
      >
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
       <StoreIcon sx={{ fontSize: 60, }} />  Nuestras Tiendas
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Descubre las mejores tiendas de alquiler de construcción
        </Typography>
      </Box>

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 1}}>
        <TextField
          fullWidth
          placeholder="Buscar tiendas por nombre, descripción o tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }
          }}
        />
      </Box>

      {/* Contador de resultados */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1" color="text.secondary">
          Mostrando {filteredStores.length} de {stores.length} tiendas
        </Typography>
      </Box>

      {/* Grid de tiendas */}
      {filteredStores.length === 0 ? (
        <Alert severity="info">
          No se encontraron tiendas que coincidan con tu búsqueda.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredStores.map((store) => (
            <Grid item size={{xs:12, sm:6, md:4}} key={store.id}>
              <StoreCard
                store={store}
                onStoreClick={(storeId) => {                
                   navigate(`/store/${storeId}`)
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}