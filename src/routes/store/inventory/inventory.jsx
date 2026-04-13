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
import { productService } from "../../../services/productServices";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import AddProduct from "../../../Pages/inventory/addProduct";
import ViewProducts from "../../../Pages/inventory/viewProducts";
import CloseProduct from "../../../components/inventary/closeProduct";

// Mock data - en producción esto vendría de Firebase

const Inventary = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");  
  const [success, setSuccess] = useState("");
  // 👇 Obtener el usuario actual del contexto y navigate

  const params = useParams();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    category: "",
    /* stock: 0,
    price: 0,
    condition: "nuevo", */
    isActive: true,
  });

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
 const navigate = useNavigate();
  const { storeId } = useParams();
  const handleOpenDialog = (product = null) => {
     navigate(`/my_store/${storeId}/inventary/add_product`);
  };
  // Manejar imagen URL

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
