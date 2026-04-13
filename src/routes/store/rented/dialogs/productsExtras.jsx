import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Paper,
  IconButton,
  Collapse,
  alpha,
} from "@mui/material";
import {
  Search,
  Inventory,
  Add,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from "@mui/icons-material";
import { useInfiniteProductsExtra } from "../../../../components/product/infinityScroll";
const DialogProductsExtra = ({
  setProduct,
  addProductDialog,
  setQuantity,
  handleProductSelect,
  handleCloseDialog,
  Inventory: InventoryIcon,
  searchTerm,
  setSearchTerm,
  selectedProduct,
}) => {
  const infiniteProductsResult = useInfiniteProductsExtra();
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [selectedSubproduct, setSelectedSubproduct] = useState(null);
  const [subproductQuantity, setSubproductQuantity] = useState(1);

  const {
    products = [],
    loading = false,
    loadingMore = false,
    hasMore = false,
    error = null,
    loadMore = () => {},
    refresh = () => {},
  } = infiniteProductsResult || {};

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasMore &&
        !loadingMore
      ) {
        loadMore();
      }
    },
    [loadMore, hasMore, loadingMore],
  );

  const filteredProducts =
    products?.filter(
      (product) =>
        product?.name
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "") ||
        product?.category
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || ""),
    ) || [];

  const handleProductClick = (product) => {
    if (expandedProduct === product.id) {
      setExpandedProduct(null);
      setSelectedSubproduct(null);
    } else {
      setExpandedProduct(product.id);
      setSelectedSubproduct(null);
      handleProductSelect(product);
    }
  };

  const handleSubproductSelect = (subproduct) => {
    setSelectedSubproduct(subproduct);
    setSubproductQuantity(1);
  };

  const handleAddProduct = () => {
    if (selectedSubproduct && subproductQuantity > 0) {
      const newProduct = {
        id: selectedSubproduct.sku || selectedSubproduct.id,
        name: `${selectedProduct?.name} - ${selectedSubproduct.name}`,
        //price: selectedSubproduct.price,
        state: "pendiente",
        store: selectedProduct?.store,
        image: selectedProduct?.image,
        extra: true,
        subproducto: {
          ...selectedSubproduct,
          quantity: subproductQuantity,
          parentId: selectedProduct?.id,
          parentName: selectedProduct?.name,
          sku: selectedSubproduct.sku,
          stock: selectedSubproduct.stock,
          rented: selectedSubproduct.rented || 0,
        },
      };

      setProduct((prev) => [...prev, newProduct]);
      handleCloseDialog();
      setQuantity(1);
      setSubproductQuantity(1);
      setSearchTerm("");
      setSelectedSubproduct(null);
      setExpandedProduct(null);
    }
  };

  const getAvailableStock = (subproduct) => {
    return (subproduct.stock || 0) - (subproduct.rented || 0);
  };

  const getStockStatus = (subproduct) => {
    const available = getAvailableStock(subproduct);
    if (available <= 0)
      return { label: "Sin stock", color: "error", disabled: true };
    if (available < 5)
      return {
        label: `Stock bajo: ${available}`,
        color: "warning",
        disabled: false,
      };
    return {
      label: `${available} disponibles`,
      color: "success",
      disabled: false,
    };
  };

  return (
    <Dialog
      open={addProductDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <InventoryIcon
          sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }}
        />
        Agregar Producto
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Contador de resultados */}
        {filteredProducts.length > 0 && !loading && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </Typography>
        )}

        {/* Lista de productos con subproductos */}
        <Box
          sx={{ maxHeight: 450, overflow: "auto", mb: 2 }}
          onScroll={handleScroll}
        >
          {loading && !loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredProducts.map((product, index) => {
                const hasSubproducts =
                  product.suproducts && product.suproducts.length > 0;
                const isExpanded = expandedProduct === product.id;

                return (
                  <Box key={product?.id || index}>
                    {/* Producto principal */}
                    <ListItem
                      component="div"
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: isExpanded ? "primary.main" : "divider",
                        bgcolor: isExpanded
                          ? alpha("#1976d2", 0.04)
                          : "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: alpha("#1976d2", 0.02),
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={
                            Array.isArray(product?.image)
                              ? product?.image[0]
                              : product?.image
                          }
                          alt={product?.name}
                          sx={{ width: 48, height: 48 }}
                          variant="rounded"
                        >
                          <InventoryIcon />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {product?.name || "Producto sin nombre"}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {product?.category || "Sin categoría"}
                            </Typography>
                            <Chip
                              label={`${hasSubproducts ? product.suproducts.length : 0} variantes`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.7rem", mt: 0.5 }}
                            />
                          </Box>
                        }
                      />

                      {hasSubproducts && (
                        <IconButton
                          onClick={() => handleProductClick(product)}
                          size="small"
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                    </ListItem>

                    {/* Subproductos */}
                    {hasSubproducts && (
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ pl: 7, pr: 2, mb: 2 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1, display: "block" }}
                          >
                            Selecciona una variante:
                          </Typography>

                          {product.suproducts.map((subproduct, subIndex) => {
                            const stockStatus = getStockStatus(subproduct);
                            const isSelected =
                              selectedSubproduct?.sku === subproduct.sku;

                            return (
                              <Paper
                                key={subproduct.sku || subIndex}
                                variant="outlined"
                                sx={{
                                  p: 1.5,
                                  mb: 1,
                                  cursor: stockStatus.disabled
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: stockStatus.disabled ? 0.6 : 1,
                                  borderColor: isSelected
                                    ? "primary.main"
                                    : "divider",
                                  bgcolor: isSelected
                                    ? alpha("#1976d2", 0.04)
                                    : "background.paper",
                                  transition: "all 0.2s ease",
                                  "&:hover": stockStatus.disabled
                                    ? {}
                                    : {
                                        borderColor: "primary.main",
                                        bgcolor: alpha("#1976d2", 0.02),
                                      },
                                }}
                                onClick={() =>
                                  !stockStatus.disabled &&
                                  handleSubproductSelect(subproduct)
                                }
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {subproduct.name || "Variante sin nombre"}
                                    </Typography>
                                    {subproduct.sku && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        SKU: {subproduct.sku}
                                      </Typography>
                                    )}
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      alignItems: "center",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Chip
                                      label={`$${subproduct.price || 0}/día`}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                    <Chip
                                      label={stockStatus.label}
                                      size="small"
                                      color={stockStatus.color}
                                    />
                                    {isSelected && (
                                      <CheckCircle
                                        color="primary"
                                        sx={{ fontSize: 20 }}
                                      />
                                    )}
                                  </Box>
                                </Box>

                                {subproduct.description && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mt: 0.5, display: "block" }}
                                  >
                                    {subproduct.description}
                                  </Typography>
                                )}
                              </Paper>
                            );
                          })}
                        </Box>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </List>
          )}

          {loadingMore && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                gap: 1,
              }}
            >
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Cargando más...
              </Typography>
            </Box>
          )}

          {!hasMore && filteredProducts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                — Fin de la lista —
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Typography variant="body2" color="error">
                Error: {error}
              </Typography>
            </Box>
          )}

          {filteredProducts.length === 0 && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron productos
              </Typography>
            </Box>
          )}
        </Box>

        {/* Selección de cantidad para subproducto seleccionado */}
        {selectedSubproduct && (
          <>
            <Divider sx={{ my: 2 }} />
            <Paper
              sx={{ p: 2, bgcolor: alpha("#1976d2", 0.04), borderRadius: 2 }}
            >
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Producto seleccionado:
              </Typography>
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
                <Box>
                  <Typography variant="body2">
                    {selectedProduct?.name} - {selectedSubproduct.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SKU: {selectedSubproduct.sku} | Precio: $
                    {selectedSubproduct.price}/día
                  </Typography>
                </Box>
                <Chip
                  label={`Stock disponible: ${getAvailableStock(selectedSubproduct)}`}
                  size="small"
                  color={
                    getAvailableStock(selectedSubproduct) > 0
                      ? "success"
                      : "error"
                  }
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                type="number"
                label="Cantidad"
                value={subproductQuantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const maxStock = getAvailableStock(selectedSubproduct);

                  if (value > maxStock) {
                    setSubproductQuantity(maxStock);
                  } else if (value < 1 || isNaN(value)) {
                    setSubproductQuantity(1);
                  } else {
                    setSubproductQuantity(value);
                  }
                }}
                inputProps={{
                  min: 1,
                  max: getAvailableStock(selectedSubproduct),
                  step: 1,
                }}
                helperText={`Stock disponible: ${getAvailableStock(selectedSubproduct)} unidades`}
              />
            </Paper>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleAddProduct}
          variant="contained"
          disabled={
            !selectedSubproduct ||
            subproductQuantity <= 0 ||
            getAvailableStock(selectedSubproduct) <= 0
          }
          startIcon={<Add />}
          sx={{ fontWeight: "medium" }}
        >
          Agregar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogProductsExtra;
