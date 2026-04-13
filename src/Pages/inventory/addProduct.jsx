import React, { useEffect, useRef, useState } from "react";
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
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Delete,
  CloudUpload,
  Add,
  Inventory,
  ShoppingCart,
  Edit,
  Save,
  Cancel,
  ContentCopy,
} from "@mui/icons-material";
import { uploadMultipleImages } from "../../services/imageServices";
import { useParams } from "react-router-dom";
import { productService } from "../../services/productServices";
import { useAuth } from "../../context/AuthContext";

const categories = [
  "Andamios",
  "Encofrado",
  "Equipos-seguridad",
  "Herramientas-electricas",
  "Herramientas-manuales",
  "Maquinaria-pesada",
  "Materiales",
  "Sanitario",
];

const conditions = [
  "nuevo",
  "usado-excelente",
  "usado-bueno",
  "usado-regular",
  "requiere-mantenimiento",
];

export default function AddProduct({ isPaidStore = false }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [product, setProduct] = useState({
    name: "",
    category: "",
    tags: [],
    suproducts: [],
    images: [],
    isActive: true,
    extra: false,
  });
  const [success, setSuccess] = useState("");
  const [editingSubproduct, setEditingSubproduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { storeId, productId } = useParams();
  const { user } = useAuth();
  const randomStr = Math.random().toString(36).substring(2, 10);
  useEffect(() => {
    if (productId) {
      loadProducts();
    }
  }, [productId]);

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const itemData = await productService.getProductItemById(productId);
      setProduct(itemData);
    } catch (err) {
      setError("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    const tagsArray = typeof value === "string" ? value.split(",") : value;
    setProduct((prev) => ({
      ...prev,
      tags: tagsArray.map((tag) => tag.trim()),
    }));
  };

  console.log(user);
  const handleSaveProduct = async () => {
    try {
      if (!product.name.trim()) {
        setError("El nombre del producto es requerido");
        return;
      }

      const productData = {
        name: product.name.trim(),
        category: product.category,
        extra: product.extra,
        desc: product.desc || "no existe descripción",
        rate: { good: 0, medio: 0, bad: 0, total: 0 },
        tags: product.tags || [],
        rented: 0,
        suproducts: product.suproducts,
        image: product.images || null,
        isActive: product.isActive,
        addedBy: user?.displayName,
        updatedAt: new Date(),
      };

      if (productId) {
        await productService.updateProduct(productId, productData);
        setSuccess("Producto actualizado correctamente");
      } else {
        const newProductId = await productService.createProduct(
          productData,
          user.uid,
          storeId,
        );
        await productService.addProductToStore(newProductId.id, storeId);
        setSuccess("Producto agregado correctamente");
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError("Error guardando producto: " + err.message);
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const maxImages = isPaidStore ? 10 : 1;
    const currentImages = product.images ? product.images.length : 0;
    const availableSlots = maxImages - currentImages;

    if (files.length > availableSlots) {
      alert(
        `Solo puedes agregar ${availableSlots} imagen${availableSlots > 1 ? "es" : ""} más`,
      );
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const imageUrls = await uploadMultipleImages(files);
      const updatedImages = product.images
        ? [...product.images, ...imageUrls]
        : imageUrls;
      handleInputChange("images", updatedImages);
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      alert("Error al subir las imágenes: " + error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = product.images.filter(
      (_, index) => index !== indexToRemove,
    );
    handleInputChange("images", updatedImages);
  };

  const handleAddSubproduct = () => {
    const newSubproduct = {
      id: Date.now(),
      name: "",
      sku: randomStr,
      price: 0,
      priceLost: 0,
      stock: 0,
      total: 0,
      condition: "nuevo",
      isActive: true,
    };
    setEditingSubproduct(newSubproduct);
    setEditDialogOpen(true);
  };

  const handleEditSubproduct = (subproduct) => {
    setEditingSubproduct({ ...subproduct, sku: randomStr });
    setEditDialogOpen(true);
  };

  const handleSaveSubproduct = () => {
    // Validación: nombre requerido
    if (!editingSubproduct?.name?.trim()) {
      setError("El nombre del subproducto es requerido");
      return;
    }

    // Validación: precio debe ser válido
    if (editingSubproduct?.price < 0) {
      setError("El precio no puede ser negativo");
      return;
    }

    // Validación: stock debe ser válido
    if (editingSubproduct?.stock < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    // Asegurar que product.suproducts existe
    const currentSubproducts = product.suproducts || [];

    // Buscar si ya existe un subproducto con el mismo SKU (excluyendo el actual si es edición)
    const existingIndex = currentSubproducts.findIndex(
      (s) =>
        s.sku === editingSubproduct.sku &&
        s.sku !== editingSubproduct.originalSku,
    );

    let updatedSubproducts;

    if (existingIndex >= 0) {
      // Actualizar subproducto existente
      updatedSubproducts = [...currentSubproducts];
      updatedSubproducts[existingIndex] = {
        ...editingSubproduct,
        updatedAt: new Date(),
      };
    } else if (
      editingSubproduct.id &&
      currentSubproducts.find((s) => s.id === editingSubproduct.id)
    ) {
      // Editar subproducto existente por ID
      const editIndex = currentSubproducts.findIndex(
        (s) => s.id === editingSubproduct.id,
      );
      updatedSubproducts = [...currentSubproducts];
      updatedSubproducts[editIndex] = {
        ...editingSubproduct,
        updatedAt: new Date(),
      };
    } else {
      // Agregar nuevo subproducto
      const newSubproduct = {
        ...editingSubproduct,
        id: Date.now(),
        sku: editingSubproduct.sku || `SKU-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updatedSubproducts = [...currentSubproducts, newSubproduct];
    }

    // Actualizar el estado
    handleInputChange("suproducts", updatedSubproducts);

    // Limpiar y cerrar
    setEditDialogOpen(false);
    setEditingSubproduct(null);
    setError("");

    // Mensaje de éxito
    setSuccess("Subproducto guardado correctamente");
    setTimeout(() => setSuccess(""), 3000);
  };
  const handleRemoveSubproduct = (id, rented, stock, name) => {
    // Verificar si hay unidades alquiladas
    if (rented && rented > 0) {
      setError(
        `No se puede eliminar "${name || "este subproducto"}" porque tiene ${rented} unidad${rented !== 1 ? "es" : ""} alquilada${rented !== 1 ? "s" : ""}.`,
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Confirmar eliminación si no hay alquilados
    if (
      window.confirm(
        `¿Estás seguro de eliminar "${name || "este subproducto"}"?`,
      )
    ) {
      const updatedSubproducts = product.suproducts.filter((s) => s.sku !== id);
      handleInputChange("suproducts", updatedSubproducts);
      setSuccess("Subproducto eliminado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDuplicateSubproduct = (subproduct) => {
    let num = Math.random();
    const newSubproduct = {
      ...subproduct,
      id: Date.now(),
      rented: 0,
      name: `${subproduct.name} (copia)`,
      // sku: `${subproduct.sku}-${num.toFixed(6)}`,
      sku: randomStr,
    };
    const updatedSubproducts = [...(product.suproducts || []), newSubproduct];
    handleInputChange("suproducts", updatedSubproducts);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "Sin stock", color: "error" };
    if (stock < 5) return { label: `Stock bajo: ${stock}`, color: "warning" };
    return { label: `${stock} disponibles`, color: "success" };
  };

  const maxImages = isPaidStore ? 10 : 1;
  const currentImageCount = product.images ? product.images.length : 0;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        {productId ? `Editar Producto` : "Agregar Producto"}
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Información General */}
        <Grid item size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Inventory color="primary" />
              Información General
            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={product.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Ej: Taladro Eléctrico, Escalera Plegable..."
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={product.category || ""}
                    label="Categoría"
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Etiquetas"
                  value={product.tags ? product.tags.join(", ") : ""}
                  onChange={handleTagsChange}
                  placeholder="herramientas, eléctricas, construcción"
                  helperText="Separadas por coma"
                />
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="descripción"
                  value={product.desc || ""}
                  multiline
                  rows={4}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  required
                  placeholder="describe el producto de queiras alquilar, agrega características, usos, recomendaciones, etc..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Subproductos - Tabla */}
        <Grid item size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingCart color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Variantes / Subproductos
                </Typography>
                <Chip
                  label={`${product.suproducts?.length || 0} variantes`}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSubproduct}
                size="small"
              >
                Agregar Variante
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Las variantes te permiten ofrecer diferentes opciones del mismo
              producto (tallas, colores, modelos)
            </Alert>

            {product.suproducts && product.suproducts.length > 0 ? (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2, overflowX: "auto" }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: "action.hover" }}>
                    <TableRow>
                      <TableCell>
                        <strong>#</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Nombre</strong>
                      </TableCell>
                      {/*  <TableCell>
                        <strong>SKU</strong>
                      </TableCell> */}
                      <TableCell align="right">
                        <strong>Precio/día</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Stock</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Alquilados</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Condición</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Estado</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Acciones</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.suproducts.map((subP, index) => {
                      const stockStatus = getStockStatus(subP.stock || 0);
                      return (
                        <TableRow key={subP.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {subP.name || "Sin nombre"}
                          </TableCell>
                          {/* <TableCell>
                            <Chip
                              label={subP.sku || "Sin SKU"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell> */}
                          <TableCell align="right">
                            <Typography fontWeight="bold" color="primary.main">
                              ${(subP.price || 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={stockStatus.label}
                              size="small"
                              color={stockStatus.color}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={subP.rented || 0}
                              size="small"
                              color="warning"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={subP.rented || 0 + subP.stock}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={subP.condition || "nuevo"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                subP.isActive !== false ? "Activo" : "Inactivo"
                              }
                              size="small"
                              color={
                                subP.isActive !== false ? "success" : "default"
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditSubproduct(subP)}
                                  color="primary"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Duplicar">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDuplicateSubproduct(subP)
                                  }
                                  color="secondary"
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveSubproduct(
                                      subP.sku,
                                      subP.rented,
                                      subP.stock,
                                    )
                                  }
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <ShoppingCart
                  sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sin variantes definidas
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Agrega variantes para ofrecer diferentes opciones
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddSubproduct}
                >
                  Agregar primera variante
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Imágenes */}
        <Grid item size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AddPhotoAlternate color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Imágenes del Producto
                </Typography>
              </Box>
              <Chip
                label={`${currentImageCount}/${maxImages}`}
                variant="outlined"
              />
            </Box>

            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              {isPaidStore
                ? "Tienda Premium: Hasta 10 imágenes"
                : "Tienda Básica: 1 imagen principal"}
            </Alert>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
              >
                Subir Archivo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple={isPaidStore}
                style={{ display: "none" }}
              />
            </Box>

            {uploading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {product.images && product.images.length > 0 && (
              <Grid container spacing={2}>
                {product.images.map((imageUrl, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: 180,
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          bgcolor: "action.hover",
                        }}
                      />
                      <Box sx={{ p: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={imageUrl}
                          onChange={(e) => {
                            const updatedImages = [...product.images];
                            updatedImages[index] = e.target.value;
                            handleInputChange("images", updatedImages);
                          }}
                        />
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveImage(index)}
                          sx={{ mt: 1 }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Configuración */}
        <Grid item size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Configuración General
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.isActive || false}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                    />
                  }
                  label="Producto activo para alquiler"
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.extra}
                      onChange={(e) =>
                        handleInputChange("extra", e.target.checked)
                      }
                    />
                  }
                  label="Producto complementario (sin costo)"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Botones de acción */}
        <Grid item size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              pb: 2,
              mb: 2,
            }}
          >
            <Button variant="outlined" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveProduct}
            >
              {productId ? "Actualizar" : "Guardar"} Producto
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Diálogo de edición de subproducto */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSubproduct?.id ? "Editar Variante" : "Nueva Variante"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={editingSubproduct?.name || ""}
                onChange={(e) =>
                  setEditingSubproduct({
                    ...editingSubproduct,
                    name: e.target.value,
                  })
                }
                required
              />
            </Grid>
            {/* <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="SKU"
                disabled={!!editingSubproduct?.sku}
                value={editingSubproduct?.sku || ""}
                onChange={(e) =>
                  setEditingSubproduct({
                    ...editingSubproduct,
                    sku: e.target.value,
                  })
                }
              /> 
            </Grid>*/}
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Condición</InputLabel>
                <Select
                  value={editingSubproduct?.condition || "nuevo"}
                  label="Condición"
                  onChange={(e) =>
                    setEditingSubproduct({
                      ...editingSubproduct,
                      condition: e.target.value,
                    })
                  }
                >
                  {conditions.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Precio por día"
                type="number"
                value={editingSubproduct?.price || 0}
                onChange={(e) =>
                  setEditingSubproduct({
                    ...editingSubproduct,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                InputProps={{ startAdornment: "$" }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Precio pérdida"
                type="number"
                value={editingSubproduct?.priceLost || 0}
                onChange={(e) =>
                  setEditingSubproduct({
                    ...editingSubproduct,
                    priceLost: parseFloat(e.target.value) || 0,
                  })
                }
                InputProps={{ startAdornment: "$" }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={editingSubproduct?.stock || 0}
                onChange={(e) =>
                  setEditingSubproduct({
                    ...editingSubproduct,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingSubproduct?.isActive !== false}
                    onChange={(e) =>
                      setEditingSubproduct({
                        ...editingSubproduct,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label="Activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveSubproduct}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensajes de éxito/error */}
      {success && (
        <Alert
          severity="success"
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
