// components/ProductManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import {
  productService,
 
} from "../../services/productServices";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import AddProduct from "../../components/inventary/addProduct";
import ViewProducts from "../../components/inventary/viewProducts";
import CloseProduct from "../../components/inventary/closeProduct";

// Mock data - en producción esto vendría de Firebase


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
      const itemData = await productService.getAllProductItem(params.storeId);
     
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
        priceLost:product.priceLost,
        condition: product.condition,
        isActive: product.isActive,
        extra: product.extra,
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
        rate: {
          good: 0,
          medio: 0,
          bad: 0,
          total:0
        }, // ¿Esto es correcto? O debería ser otro campo?
        tags: formData.tags, // Ya es un array, no necesita trim()
        stock: parseInt(formData.stock),
        rented: 0,
        price: parseFloat(formData.price),
        condition: formData.condition,
        category: formData.category,
        image: [imageUrl.trim()]|| null,
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
          params.storeId
        );
        await productService.addProductToStore(newProductId.id, params.storeId);
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
      
          <ViewProducts
            products={products}
            getAvailableStock={getAvailableStock}
            getStockColor={getStockColor}
            getConditionColor={getConditionColor}
            handleOpenDialog={handleOpenDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />

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
          <AddProduct
            categories={categories}
            formData={formData}
            handleInputChange={handleInputChange}
            handleTagsChange={handleTagsChange}
            conditions={conditions}
          />
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
      <CloseProduct
        handleCloseDeleteDialog
        selectedProduct
        openDeleteDialo
        handleDeleteProduct
      />
    </Box>
  );
};

export default Inventary;
