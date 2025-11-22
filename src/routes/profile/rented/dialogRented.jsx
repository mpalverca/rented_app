import React, { useState } from "react";
import {
  Box,
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
  Chip,
} from "@mui/material";
import MapView from "../../../components/maps/mapView";

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
