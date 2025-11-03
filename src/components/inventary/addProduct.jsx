import React, { useRef } from "react";
import {
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Chip,
  Typography,
  Alert,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Delete,
} from "@mui/icons-material";

export default function AddProduct({
  categories, 
  formData, 
  handleInputChange,
  handleTagsChange, 
  conditions,
  isPaidStore = false // Nueva prop para saber si la tienda es de pago
}) {
  const fileInputRef = useRef(null);

  const handleAddImage = () => {
    const maxImages = isPaidStore ? 10 : 1;
    const currentImages = formData.images ? formData.images.length : 0;
    
    if (currentImages >= maxImages) {
      alert(`Límite alcanzado: ${isPaidStore ? '10' : '1'} imagen${isPaidStore ? 'es' : ''} permitida${isPaidStore ? 's' : ''}`);
      return;
    }

    // Simular subida de imagen (luego integrar con imgur)
    const newImageUrl = `https://via.placeholder.com/300x200/4CAF50/white?text=Imagen+${currentImages + 1}`;
    
    const updatedImages = formData.images 
      ? [...formData.images, newImageUrl]
      : [newImageUrl];
    
    handleInputChange("images", updatedImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = formData.images.filter((_, index) => index !== indexToRemove);
    handleInputChange("images", updatedImages);
  };

  const handleImageUrlChange = (index, newUrl) => {
    const updatedImages = formData.images.map((url, i) => 
      i === index ? newUrl : url
    );
    handleInputChange("images", updatedImages);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const maxImages = isPaidStore ? 10 : 1;
    const currentImages = formData.images ? formData.images.length : 0;
    const availableSlots = maxImages - currentImages;
    
    if (files.length > availableSlots) {
      alert(`Solo puedes agregar ${availableSlots} imagen${availableSlots > 1 ? 'es' : ''} más`);
      return;
    }

    // Simular procesamiento de archivos (luego integrar con imgur)
    const newImageUrls = Array.from(files).map((file, index) => 
      URL.createObjectURL(file)
      // En producción, aquí subirías a imgur y obtendrías la URL real
    );

    const updatedImages = formData.images 
      ? [...formData.images, ...newImageUrls]
      : newImageUrls;
    
    handleInputChange("images", updatedImages);
    
    // Limpiar input file
    event.target.value = '';
  };

  const maxImages = isPaidStore ? 10 : 1;
  const currentImageCount = formData.images ? formData.images.length : 0;

  return (
    <div>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del Producto"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category}
              label="Categoría"
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Etiquetas (separadas por coma)"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
            placeholder="herramientas, eléctricas, construcción"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Stock Total"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              handleInputChange("stock", parseInt(e.target.value) || 0)
            }
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Precio por Día ($)"
            type="number"
            value={formData.price}
            onChange={(e) =>
              handleInputChange("price", parseFloat(e.target.value) || 0)
            }
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Precio por pérdida ($)"
            type="number"
            value={formData.priceLost || ""}
            onChange={(e) =>
              handleInputChange("priceLost", parseFloat(e.target.value) || 0)
            }
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Condición</InputLabel>
            <Select
              value={formData.condition}
              label="Condición"
              onChange={(e) => handleInputChange("condition", e.target.value)}
            >
              {conditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sección de Imágenes */}
        <Grid item xs={12}>
          <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Imágenes del Producto
              </Typography>
              <Chip 
                label={`${currentImageCount}/${maxImages}`}
                color={currentImageCount >= maxImages ? "error" : "primary"}
                variant="outlined"
              />
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              {isPaidStore 
                ? "Tienda Premium: Puedes agregar hasta 10 imágenes"
                : "Tienda Básica: Solo puedes agregar 1 imagen"
              }
            </Alert>

            {/* Botones para agregar imágenes */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternate />}
                onClick={handleAddImage}
                disabled={currentImageCount >= maxImages}
              >
                Agregar Imagen (URL)
              </Button>

              <Button
                variant="contained"
                startIcon={<AddPhotoAlternate />}
                onClick={() => fileInputRef.current?.click()}
                disabled={currentImageCount >= maxImages}
              >
                Subir Archivo
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple={isPaidStore}
                style={{ display: 'none' }}
              />
            </Box>

            {/* Lista de imágenes actuales */}
            {formData.images && formData.images.length > 0 && (
              <Grid container spacing={2}>
                {formData.images.map((imageUrl, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ border: '1px solid #eee', p: 1, borderRadius: 1 }}>
                      {/* Vista previa de imagen */}
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: 120, 
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: 1,
                          mb: 1
                        }}
                      />
                      
                      {/* Input para editar URL */}
                      <TextField
                        fullWidth
                        size="small"
                        value={imageUrl}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="URL de la imagen"
                        sx={{ mb: 1 }}
                      />
                      
                      {/* Botón eliminar */}
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleRemoveImage(index)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {(!formData.images || formData.images.length === 0) && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No hay imágenes agregadas. Usa los botones arriba para agregar imágenes.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                color="primary"
              />
            }
            label="Producto activo para alquiler"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.extra || false}
                onChange={(e) =>
                  handleInputChange("extra", e.target.checked)
                }
                color="primary"
              />
            }
            label="Producto extra - artículos necesarios para alquiler pero no tiene un precio"
          />
        </Grid>
      </Grid>
    </div>
  );
}