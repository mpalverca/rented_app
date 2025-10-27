import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { PhotoCamera, LocationOn, Add } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 👇 Importar useNavigate en lugar de Navigate
import { useNavigate } from 'react-router-dom';
import { storeService } from '../../services/storeServices';
import { useAuth } from '../../context/AuthContext';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

const CreateStore = () => {
  // 👇 Obtener el usuario actual del contexto y navigate
  const { user } = useAuth();
  const navigate = useNavigate(); // 👈 CORRECTO: useNavigate hook
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    website: '',
    horario: ''
  });

  // Estados para tags y ubicación
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [position, setPosition] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Referencia para el input de imagen
  const fileInputRef = useRef(null);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Manejar imagen URL
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Simular carga de imagen desde URL
  const handleLoadImage = () => {
    if (imageUrl) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess('Imagen cargada correctamente');
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    }
  };

  // 👇 FUNCIÓN CORREGIDA - Con addStoreToUser y useNavigate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setError('El nombre de la tienda es obligatorio');
      setLoading(false);
      return;
    }
    
    if (!formData.direccion.trim()) {
      setError('La dirección de la tienda es obligatoria');
      setLoading(false);
      return;
    }
    
    if (!formData.telefono.trim()) {
      setError('El teléfono de la tienda es obligatorio');
      setLoading(false);
      return;
    }
    
    if (tags.length > 3) {
      setError('Colocar máximo 3 etiquetas');
      setLoading(false);
      return;
    }
    
    if (!position) {
      setError('Debes seleccionar una ubicación en el mapa');
      setLoading(false);
      return;
    }

    // Verificar que el usuario esté autenticado
    if (!user) {
      setError('Debes estar autenticado para crear una tienda');
      setLoading(false);
      return;
    }

    try {
      // 👇 Preparar datos para Firestore
      const storeData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        horario: formData.horario.trim() || null,
        tags: tags,
        ubicacion: {
          lat: position.lat,
          lng: position.lng
        },
        imagen: imageUrl.trim() || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        activa: true,
        estado: 'activa'
      };

      console.log('📦 Paso 1: Creando tienda...');

      // 👇 PASO 1: Crear la tienda
      const nuevaTienda = await storeService.createStore(storeData, user.uid);
      
      console.log('✅ Tienda creada con ID:', nuevaTienda.id);

      // 👇 PASO 2: Actualizar el usuario con la tienda
      console.log('👤 Paso 2: Actualizando usuario...');
      await storeService.addStoreToUser(user.uid, nuevaTienda.id, formData.nombre.trim());
      
      console.log('✅ Usuario actualizado exitosamente');

      setSuccess(`¡Tienda "${formData.nombre}" creada exitosamente y agregada a tu perfil!`);
      
      // 👇 Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/rented_app/mi_tienda"); // 👈 CORRECTO: useNavigate
      }, 2000);

      // 👇 Resetear formulario
      setTimeout(() => {
        setFormData({
          nombre: '',
          descripcion: '',
          direccion: '',
          telefono: '',
          email: '',
          website: '',
          horario: ''
        });
        setTags([]);
        setPosition(null);
        setImageUrl('');
      }, 2000);

    } catch (err) {
      console.error('❌ Error al crear la tienda:', err);
      setError('Error al crear la tienda: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... el resto del código JSX se mantiene igual
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          background: "linear-gradient(45deg, #FF5733 20%, #FFD700 90%)",
          mb: 4
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          🏪 Crear Nueva Tienda
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ color: 'white', opacity: 0.9 }}
        >
          Completa la información de tu tienda para comenzar a alquilar
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Columna izquierda - Formulario */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF5733', mb: 3 }}>
              Información Básica
            </Typography>

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

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Nombre */}
                <Grid item size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Nombre de la Tienda"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Mi Tienda Online"
                  />
                </Grid>

                {/* Descripción */}
                <Grid item size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe los productos o servicios de tu tienda..."
                  />
                </Grid>

                {/* Tags */}
                <Grid item size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Etiquetas (Tags) - Máximo 3
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Agregar etiqueta..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      sx={{ flexGrow: 1 }}
                      disabled={tags.length >= 3}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddTag}
                      disabled={tags.length >= 3 || !tagInput.trim()}
                    >
                      Agregar
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {tags.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Agrega hasta 3 etiquetas para describir tu tienda
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: '#FF5733' }}>
                    Información de Contacto
                  </Typography>
                </Grid>

                {/* Dirección */}
                <Grid item size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Dirección física de la tienda"
                  />
                </Grid>

                {/* Teléfono y Email */}
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                  />
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tienda@ejemplo.com"
                  />
                </Grid>

                {/* Website */}
                <Grid item size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Sitio Web"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://mitienda.com"
                  />
                </Grid>               
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Columna derecha - Mapa e Imagen */}
        <Grid item size={{ xs: 12, md: 6 }}>
          {/* Mapa */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF5733', mb: 2 }}>
              <LocationOn sx={{ mr: 1 }} />
              Ubicación
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Haz clic en el mapa para seleccionar la ubicación de tu tienda
            </Typography>
            
            <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={[-3.994843, -79.204680]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </Box>
            
            {position && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  ✅ Ubicación seleccionada: 
                  Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Imagen de la Tienda */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF5733', mb: 2 }}>
              <PhotoCamera sx={{ mr: 1 }} />
              Imagen de la Tienda
            </Typography>
            
            <TextField
              fullWidth
              label="URL de la Imagen"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://ejemplo.com/imagen-tienda.jpg"
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="outlined"
              onClick={handleLoadImage}
              disabled={!imageUrl || loading}
              startIcon={loading ? <CircularProgress size={16} /> : <PhotoCamera />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Cargando...' : 'Cargar Imagen'}
            </Button>

            {imageUrl && !loading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Avatar
                  src={imageUrl}
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    mx: 'auto',
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                  variant="rounded"
                >
                  <PhotoCamera sx={{ fontSize: 48 }} />
                </Avatar>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Vista previa de la imagen
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Botón de Envío */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            '&:hover': {
              background: "linear-gradient(45deg, #E64A19 30%, #FBC02D 90%)",
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              Creando Tienda...
            </Box>
          ) : (
            '🏪 Crear Tienda y Actualizar Perfil'
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateStore;