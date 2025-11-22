import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  InputLabel,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  DialogActions,
  FormControlLabel,
  TextField,
  Typography,
  FormControl,
  Grid,
  Card,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,

} from "@mui/material";
import MapView from "../../../components/maps/mapView";
import { Search } from "@mui/icons-material";
import {
  useInfiniteProductsExtra,
  useInfiniteProductsStore,
} from "../../../components/product/infinityScroll";

export const DialogCar = ({ open, title, setReturnDialog, carI, carR }) => {
  const [vehicleData, setVehicleData] = useState({
    placa: "",
    dueño: "",
    identificacion: "",
    contacto: "",
  });

  const handleInputChange = (field) => (event) => {
    setVehicleData({
      ...vehicleData,
      [field]: event.target.value,
    });
  };

  const handleAddVehicle = () => {
    console.log("Vehículo agregado:", vehicleData);
    // Aquí iría la lógica para guardar el vehículo
    setVehicleData({ placa: "", dueño: "", identificacion: "", contacto: "" });
  };

  const isFormValid =
    vehicleData.placa &&
    vehicleData.dueño &&
    vehicleData.identificacion &&
    vehicleData.contacto;

  return (
    <Dialog
      open={open}
      onClose={() => setReturnDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Header con gradiente */}
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          py: 2,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Divider />
        {/* Sección Vehículo de Envío */}
        <Card
          sx={{
            p: 2,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mr: 1,
              }}
            >
              Vehículo de Envío
            </Typography>
            {carI?.requiere && (
              <Chip
                label="Confirmado"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>

          {carI && carI?.requiere === true ? (
            <Box
              sx={{ p: 1, backgroundColor: "success.light", borderRadius: 1 }}
            >
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "medium" }}
              >
                🚗 {carI.placa} • {carI.own} • 📞 {carI.phone}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No se requiere vehículo de envío
            </Typography>
          )}
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* Sección Vehículo de Retorno */}
        <Card
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mr: 1,
              }}
            >
              Vehículo de Retorno
            </Typography>
            {carR?.requiere && (
              <Chip
                label="Confirmado"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>

          {carR && carR?.requiere === true ? (
            <Box
              sx={{ p: 1, backgroundColor: "success.light", borderRadius: 1 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: "medium",
                  display: "flex",
                  justifyContent: "space-between",
                  //  alignItems: "center",
                  width: "100%",
                }}
              >
                🚗 {carR.placa} • {carR.own} • 📞 {carR.phone}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ingrese los datos del vehículo de retorno
              </Typography>

              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Placa"
                      value={vehicleData.placa}
                      onChange={handleInputChange("placa")}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Dueño"
                      value={vehicleData.dueño}
                      onChange={handleInputChange("dueño")}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Identificación"
                      value={vehicleData.identificacion}
                      onChange={handleInputChange("identificacion")}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Contacto"
                      value={vehicleData.contacto}
                      onChange={handleInputChange("contacto")}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
          )}
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={() => setReturnDialog(false)}
          variant="outlined"
          sx={{
            borderColor: "#FF5733",
            color: "#FF5733",
            "&:hover": {
              borderColor: "#E04E2E",
              backgroundColor: "rgba(255, 87, 51, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>

        {!(carR && carR?.requiere) && (
          <Button
            onClick={handleAddVehicle}
            variant="contained"
            disabled={!isFormValid}
            sx={{
              background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
              color: "white",
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                background: "linear-gradient(45deg, #E04E2E 30%, #E6C200 90%)",
                boxShadow: 3,
              },
              "&:disabled": {
                background: "grey.300",
              },
            }}
          >
            Agregar Vehículo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export const ReturnProduct = ({
  returnDialog,
  allSelected,
  someSelected,
  handleSelectAll,
  setReturnDialog,
  rentedItem,
  selectedProducts,
  returnQuantities,
  handleProductSelect,
  handleQuantityChange,
  handleReturnProducts,
}) => {
  return (
    <Dialog
      open={returnDialog}
      onClose={() => setReturnDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Devolver Productos</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={handleSelectAll}
            />
          }
          label="Seleccionar todos los productos"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 2 }} />

        {rentedItem.product.map((product) => {
          const availableToReturn =
            product.quantity - (product.returnedQuantity || 0);

          return (
            <Box
              key={product.id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedProducts[product.id] || false}
                    onChange={(e) =>
                      handleProductSelect(product.id, e.target.checked)
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Disponible para devolver: {availableToReturn} de{" "}
                      {product.quantity}
                    </Typography>
                  </Box>
                }
              />

              {selectedProducts[product.id] && availableToReturn > 0 && (
                <Box sx={{ mt: 1, ml: 4 }}>
                  <TextField
                    label="Cantidad a devolver"
                    type="number"
                    size="small"
                    value={returnQuantities[product.id] || 0}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    inputProps={{
                      min: 0,
                      max: availableToReturn,
                    }}
                    sx={{ width: 120 }}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setReturnDialog(false)}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleReturnProducts}
          disabled={
            !Object.values(selectedProducts).some((selected) => selected)
          }
        >
          Confirmar Devolución
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ViewLocation = ({ location, open, closeDialog }) => {
  return (
    <Dialog maxWidth="md" open={open} onClose={() => closeDialog(false)}>
      <DialogTitle>Ubicación en el mapa</DialogTitle>
      <DialogContent>
        <MapView position={location} height="100%" />
      </DialogContent>
    </Dialog>
  );
};

export const DialogProducts = ({
  setProduct,
  addProductDialog,
  quantity,
  setQuantity,
  handleProductSelect,
  handleCloseDialog,
  Inventory,
  searchTerm,
  setSearchTerm,
  selectedProduct,
}) => {
  // Manejar el caso donde useInfiniteProducts pueda devolver undefined
  const infiniteProductsResult = useInfiniteProductsStore();

  // Verificar que infiniteProductsResult existe antes de desestructurar
  const {
    products = [],
    loading = false,
    loadingMore = false,
    hasMore = false,
    error = null,
    loadMore = () => {},
    refresh = () => {},
  } = infiniteProductsResult || {};

  //scroll
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

      // Cargar más cuando esté cerca del final
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasMore &&
        !loadingMore
      ) {
        loadMore();
      }
    },
    [loadMore, hasMore, loadingMore]
  );

  // Filtrar productos de forma segura
  const filteredProducts =
    products?.filter(
      (product) =>
        product?.name
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "") ||
        product?.category
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "")
    ) || [];

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      console.log("Agregar producto:", selectedProduct, "Cantidad:", quantity);

      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        state: "pendiente",
        store: selectedProduct.store,
        image: selectedProduct.image,
        quantity: quantity,
      };

      // Agregar nuevo producto al final del array
      setProduct((prev) => [...prev, newProduct]);

      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={addProductDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <Inventory sx={{ mr: 1, verticalAlign: "middle" }} />
        Agregar Producto al Alquiler
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar productos por nombre o categoría..."
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Lista de productos */}
        <Box
          sx={{ maxHeight: 300, overflow: "auto", mb: 3 }}
          onScroll={handleScroll}
        >
          {loading && !loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredProducts.map((product) => (
                <ListItem
                  key={product?.id || Math.random()}
                  component="div"
                  selected={selectedProduct?.id === product?.id}
                  onClick={() => handleProductSelect(product)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
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
                      sx={{ width: 50, height: 50 }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    >
                      <Inventory />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        fontWeight="bold"
                      >
                        {product?.name || "Producto sin nombre"}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          display="block"
                        >
                          {product?.category || "Sin categoría"}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary.main"
                          fontWeight="bold"
                          display="block"
                        >
                          ${product?.price || 0} - Stock: {product?.stock || 0}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Indicadores de carga para infinite scroll */}
          {loadingMore && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Cargando más productos...
              </Typography>
            </Box>
          )}

          {!hasMore && filteredProducts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No hay más productos
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
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron productos
              </Typography>
            </Box>
          )}
        </Box>

        {/* Selección de cantidad */}
        {selectedProduct && (
          <FormControl fullWidth>
            <InputLabel>Cantidad</InputLabel>
            <Select
              value={quantity}
              label="Cantidad"
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[...Array(Math.min(selectedProduct?.stock || 1, 10))].map(
                (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? "unidad" : "unidades"}
                  </MenuItem>
                )
              )}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Stock disponible: {selectedProduct?.stock || 0} unidades
            </Typography>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{
            borderColor: "#FF5733",
            color: "#FF5733",
            "&:hover": {
              borderColor: "#E04E2E",
              backgroundColor: "rgba(255, 87, 51, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddProduct}
          variant="contained"
          disabled={!selectedProduct}
          sx={{
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            color: "white",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              background: "linear-gradient(45deg, #E04E2E 30%, #E6C200 90%)",
              boxShadow: 3,
            },
            "&:disabled": {
              background: "grey.300",
            },
          }}
        >
          Agregar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const DialogProductsExtra = ({
  setProduct,
  addProductDialog,
  quantity,
  setQuantity,
  handleProductSelect,
  handleCloseDialog,
  Inventory,
  searchTerm,
  setSearchTerm,
  selectedProduct,
}) => {
  // Manejar el caso donde useInfiniteProducts pueda devolver undefined
  const infiniteProductsResult = useInfiniteProductsExtra();

  // Verificar que infiniteProductsResult existe antes de desestructurar
  const {
    products = [],
    loading = false,
    loadingMore = false,
    hasMore = false,
    error = null,
    loadMore = () => {},
    refresh = () => {},
  } = infiniteProductsResult || {};

  //scroll
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

      // Cargar más cuando esté cerca del final
      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasMore &&
        !loadingMore
      ) {
        loadMore();
      }
    },
    [loadMore, hasMore, loadingMore]
  );

  // Filtrar productos de forma segura
  const filteredProducts =
    products?.filter(
      (product) =>
        product?.name
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "") ||
        product?.category
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase() || "")
    ) || [];

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      console.log("Agregar producto:", selectedProduct, "Cantidad:", quantity);

      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        state: "pendiente",
        store: selectedProduct.store,
        image: selectedProduct.image,
        quantity: quantity,
      };

      // Agregar nuevo producto al final del array
      setProduct((prev) => [...prev, newProduct]);

      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={addProductDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <Inventory sx={{ mr: 1, verticalAlign: "middle" }} />
        Agregar Producto al Alquiler
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Barra de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar productos por nombre o categoría..."
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Lista de productos */}
        <Box
          sx={{ maxHeight: 300, overflow: "auto", mb: 3 }}
          onScroll={handleScroll}
        >
          {loading && !loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredProducts.map((product) => (
                <ListItem
                  key={product?.id || Math.random()}
                  component="div"
                  selected={selectedProduct?.id === product?.id}
                  onClick={() => handleProductSelect(product)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
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
                      sx={{ width: 50, height: 50 }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    >
                      <Inventory />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        fontWeight="bold"
                      >
                        {product?.name || "Producto sin nombre"}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          display="block"
                        >
                          {product?.category || "Sin categoría"}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary.main"
                          fontWeight="bold"
                          display="block"
                        >
                          ${product?.price || 0} - Stock: {product?.stock || 0}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Indicadores de carga para infinite scroll */}
          {loadingMore && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Cargando más productos...
              </Typography>
            </Box>
          )}

          {!hasMore && filteredProducts.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No hay más productos
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
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron productos
              </Typography>
            </Box>
          )}
        </Box>

        {/* Selección de cantidad */}
        {selectedProduct && (
          <FormControl fullWidth>
            <InputLabel>Cantidad</InputLabel>
            <Select
              value={quantity}
              label="Cantidad"
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[...Array(Math.min(selectedProduct?.stock || 1, 10))].map(
                (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? "unidad" : "unidades"}
                  </MenuItem>
                )
              )}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Stock disponible: {selectedProduct?.stock || 0} unidades
            </Typography>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{
            borderColor: "#FF5733",
            color: "#FF5733",
            "&:hover": {
              borderColor: "#E04E2E",
              backgroundColor: "rgba(255, 87, 51, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddProduct}
          variant="contained"
          disabled={!selectedProduct}
          sx={{
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            color: "white",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              background: "linear-gradient(45deg, #E04E2E 30%, #E6C200 90%)",
              boxShadow: 3,
            },
            "&:disabled": {
              background: "grey.300",
            },
          }}
        >
          Agregar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const EditProductTable = ({
  open,
  handleCloseDialog,
  selectedProduct,
  setProduct,
}) => {
  // Estado local para los campos editables
  const [editedProduct, setEditedProduct] = useState({
    price: 0,
    quantity: 1,
  });

  // Actualizar estado local cuando cambia selectedProduct
  useEffect(() => {
    if (selectedProduct) {
      setEditedProduct({
        price: selectedProduct.price || 0,
        quantity: selectedProduct.quantity || 1,
      });
    }
  }, [selectedProduct]);

  const handleFieldChange = (field, value) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (selectedProduct) {
      setProduct((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                price: parseFloat(editedProduct.price) || 0,
                quantity: parseInt(editedProduct.quantity) || 1,
              }
            : p
        )
      );
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Editar producto {selectedProduct?.name}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Mostrar imagen del producto */}
        {selectedProduct?.image && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Avatar
              src={
                Array.isArray(selectedProduct.image)
                  ? selectedProduct.image[0]
                  : selectedProduct.image
              }
              alt={selectedProduct.name}
              sx={{
                width: 240,
                height: 240,
                border: "2px solid",
                borderColor: "divider",
              }}
              variant="rounded"
            />
          </Box>
        )}

        {/* Información del producto */}

        <Divider sx={{ my: 2 }} />

        {/* Formulario de edición */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Editar Valores
        </Typography>

        <Grid container spacing={3}>
          {/* Campo Precio */}
          <Grid item size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <TextField
                label="Precio"
                type="number"
                value={editedProduct.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
                helperText="Precio por unidad"
              />
            </FormControl>
          </Grid>
          {/* Campo Cantidad */}
          <Grid item size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <TextField
                label="Cantidad"
                type="number"
                value={editedProduct.quantity}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
                inputProps={{
                  min: 1,
                  max: 100,
                }}
                helperText="Cantidad a alquilar"
              />
            </FormControl>
          </Grid>
          {/* Campo Estado (opcional) */}
          <Grid item size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={selectedProduct?.state || "pendiente"}
                label="Estado"
                onChange={(e) => {
                  setProduct((prev) =>
                    prev.map((p) =>
                      p.id === selectedProduct.id
                        ? { ...p, state: e.target.value }
                        : p
                    )
                  );
                }}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="alquilado">Alquilado</MenuItem>
                <MenuItem value="devuelto">Devuelto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Resumen de cambios */}
        {selectedProduct && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Resumen de Cambios:
            </Typography>
            <Grid container spacing={1}>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Precio anterior diario:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  ${selectedProduct.price}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Nuevo precio diario:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={
                    editedProduct.price !== selectedProduct.price
                      ? "primary.main"
                      : "text.primary"
                  }
                >
                  ${editedProduct.price}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Cantidad anterior:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {selectedProduct.quantity}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Nueva cantidad:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={
                    editedProduct.quantity !== selectedProduct.quantity
                      ? "primary.main"
                      : "text.primary"
                  }
                >
                  {editedProduct.quantity}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal anterior diario:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  $
                  {(selectedProduct.price * selectedProduct.quantity).toFixed(
                    2
                  )}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Nuevo ubtotal diario:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="success.main"
                >
                  ${(editedProduct.price * editedProduct.quantity).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{
            borderColor: "#FF5733",
            color: "#FF5733",
            "&:hover": {
              borderColor: "#E04E2E",
              backgroundColor: "rgba(255, 87, 51, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedProduct}
          sx={{
            background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
            color: "white",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              background: "linear-gradient(45deg, #E04E2E 30%, #E6C200 90%)",
              boxShadow: 3,
            },
            "&:disabled": {
              background: "grey.300",
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

