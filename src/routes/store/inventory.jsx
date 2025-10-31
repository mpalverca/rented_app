// components/ProductManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { productService,getAllProductItems } from "../../services/productServices";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

// Mock data - en producción esto vendría de Firebase
const mockProducts = [
  {
    id: "1",
    name: "Taladro Percutor 500W",
    tags: ["herramientas", "eléctricas", "construcción"],
    addedBy: "admin@tienda.com",
    stock: 15,
    rented: 3,
    condition: "nuevo",
    price: 25,
    category: "herramientas-electricas",
    isActive: true,
  },
  {
    id: "2",
    name: "Andamio Metálico 2m",
    tags: ["andamios", "altura", "construcción"],
    addedBy: "manager@tienda.com",
    stock: 8,
    rented: 5,
    condition: "usado",
    price: 80,
    category: "andamios",
    isActive: true,
  },
  {
    id: "3",
    name: "Compactadora de Suelo",
    tags: ["maquinaria", "pesada", "exterior"],
    addedBy: "admin@tienda.com",
    stock: 2,
    rented: 2,
    condition: "nuevo",
    price: 150,
    category: "maquinaria-pesada",
    isActive: true,
  },
];

const Inventary = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // 👇 Obtener el usuario actual del contexto y navigate
  const { user } = useAuth();
  const params = useParams();
  console.log(params);
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    category: "",
    stock: 0,
    price: 0,
    condition: "nuevo",
    isActive: true,
  });

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

  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {
    try {
      setLoading(true);
      //const itemData = await getAllProductItems ();
      const itemData =await productService.getAllProductItem(params.id)
      // Simular llamada a API
      setTimeout(() => {
        setProducts(itemData);
      
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Error cargando productos");
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        tags: product.tags,
        category: product.category,
        stock: product.stock,
        price: product.price,
        condition: product.condition,
        isActive: product.isActive,
        extra:product.extra
      });
      setSelectedProduct(product);
    } else {
      setFormData({
        name: "",
        tags: [],
        category: "",
        stock: 0,
        price: 0,
        condition: "nuevo",
        isActive: true,
      });
      setSelectedProduct(null);
    }
    setOpenDialog(true);
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
        setSuccess("Imagen cargada correctamente");
        setTimeout(() => setSuccess(""), 3000);
      }, 1000);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      tags: [],
      category: "",
      stock: 0,
      price: 0,
      condition: "nuevo",
      isActive: true,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    const tagsArray = typeof value === "string" ? value.split(",") : value;
    setFormData((prev) => ({
      ...prev,
      tags: tagsArray.map((tag) => tag.trim()),
    }));
  };

  const handleSaveProduct = async () => {
    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        setError("El nombre del producto es requerido");
        return;
      }

      if (formData.stock < 0) {
        setError("El stock no puede ser negativo");
        return;
      }

      if (formData.price < 0) {
        setError("El precio no puede ser negativo");
        return;
      }

      // 👇 Preparar datos para Firestore (CORREGIDO)
      const productData = {
        name: formData.name.trim(),
        descr: formData.category.trim(), 
        extra: false,
        rate:{
          good:0,
          Medio: 0,
          Bad: 0
        },// ¿Esto es correcto? O debería ser otro campo?
        tags: formData.tags, // Ya es un array, no necesita trim()
        stock: parseInt(formData.stock),
        rented: 0,
        price: parseFloat(formData.price),
        condition: formData.condition,
        category: formData.category,
        image: imageUrl.trim() || null,
        isActive: formData.isActive,
        addedBy: user?.nombre || user?.email || "No definido",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("📦 Creando producto...", productData);

      if (selectedProduct) {
        // 👇 ACTUALIZAR producto existente
        await productService.updateProduct(selectedProduct.id, productData);

        // Actualizar estado local
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, ...productData } : p
          )
        );
        setSuccess("Producto actualizado correctamente");
      } else {
        // 👇 CREAR nuevo producto
        const newProductId = await productService.createProduct(
          productData,
          user.uid,
          params.id
        );
        await productService.addProductToStore(newProductId.id, params.id);
        // Agregar al estado local
        const newProduct = {
          id: newProductId,
          ...productData,
        };
        setProducts((prev) => [...prev, newProduct]);
        setSuccess("Producto agregado correctamente");
      }

      // Cerrar diálogo y limpiar mensajes
      handleCloseDialog();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
      setError("Error guardando producto: " + err.message);
    }
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    // Verificar si hay unidades alquiladas
    if (selectedProduct.rented > 0) {
      setError("No se puede eliminar un producto con unidades alquiladas");
      setOpenDeleteDialog(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setSuccess("Producto eliminado correctamente");
      setOpenDeleteDialog(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error eliminando producto");
    }
  };

  const getAvailableStock = (product) => {
    return product.stock - product.rented;
  };

  const getStockColor = (product) => {
    const available = getAvailableStock(product);
    if (available === 0) return "error";
    if (available < 3) return "warning";
    return "success";
  };

  const getConditionColor = (condition) => {
    const colors = {
      nuevo: "success",
      "usado-excelente": "info",
      "usado-bueno": "primary",
      "usado-regular": "warning",
      "requiere-mantenimiento": "error",
    };
    return colors[condition] || "default";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <InventoryIcon sx={{ mr: 2 }} />
          Gestión de Productos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra el inventario de productos disponibles para alquiler
        </Typography>
      </Box>

      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Botón Agregar */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Producto
        </Button>
      </Box>

      {/* Tabla de Productos */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Producto</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Etiquetas</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Agregado Por</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Stock Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Alquilados</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Disponibles</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Condición</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Precio/Día</strong>
                  </TableCell>
                   <TableCell>
                    <strong>Extra</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Estado</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          maxWidth: 200,
                        }}
                      >
                        {product.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                        {product.addedBy}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.rented}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getAvailableStock(product)}
                        color={getStockColor(product)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.condition}
                        color={getConditionColor(product.condition)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">${product.price}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.extra}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? "Activo" : "Inactivo"}
                        color={product.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(product)}
                          disabled={product.rented > 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {products.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay productos registrados
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Agregar Primer Producto
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Agregar/Editar Producto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
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

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Etiquetas (separadas por coma)"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                placeholder="herramientas, eléctricas, construcción"
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
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
            <Grid item size={{ xs: 12, sm: 4 }}>
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
            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Precio por perdida ($)"
                type="number"
                value={formData.priceLost}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Condición</InputLabel>
                <Select
                  value={formData.condition}
                  label="Condición"
                  onChange={(e) =>
                    handleInputChange("condition", e.target.value)
                  }
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={{ sx: 12 }}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {selectedProduct ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmación para Eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el producto "
            {selectedProduct?.name}"?
          </Typography>
          {selectedProduct?.rented > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No se puede eliminar porque tiene {selectedProduct.rented}{" "}
              unidades alquiladas
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            variant="contained"
            disabled={selectedProduct?.rented > 0}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventary;
