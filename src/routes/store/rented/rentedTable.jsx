import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Search, Add, Clear, Inventory, Edit } from "@mui/icons-material";
import {
  DialogProducts,
  DialogProductsExtra,
  EditProductTable,
} from "./dialogRented";

const PRODUCT_STATUS = {
  alquilado: { label: "Alquilado", color: "primary" },
  devuelto: { label: "Devuelto", color: "success" },
  pendiente: { label: "Pendiente", color: "warning" },
};

export default function RentedTable({
  setProduct,
  rentedItem,
  total,
  AssignmentReturn,
  setReturnDialog,
  state,
  days,
  accept,
}) {
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const [openExtra, setopenExtra] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedProductTable, setSelectedProductTable] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const handleCloseDialog = () => {
    setAddProductDialog(false);
    setSearchTerm("");
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleCloseExtra = () => {
    setopenExtra(false);
    // setSearchTerm("");
    // setSelectedProduct(null);
    // setQuantity(1);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when selecting new product
  };

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header con gradiente */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
          color: "white",
          px: 3,
          py: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              📦 Productos
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddProductDialog(true)}
                sx={{
                  backgroundColor: "white",
                  color: "#FF5733",
                  fontWeight: "bold",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: 3,
                  },
                }}
              >
                Agregar Producto
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setopenExtra(true)}
                sx={{
                  backgroundColor: "white",
                  color: "#FF5733",
                  fontWeight: "bold",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: 3,
                  },
                }}
              >
                Agregar Extra
              </Button>
              {state == "enviado" && (
                <Button
                  variant="contained"
                  startIcon={<AssignmentReturn />}
                  onClick={() => setReturnDialog(true)}
                  sx={{
                    backgroundColor: "white",
                    color: "#FF5733",
                    fontWeight: "bold",
                    px: 3,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      transform: "translateY(-1px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Devolver Productos
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 0,
            boxShadow: "none",
            border: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "grey.50",
                  "& th": {
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    py: 2,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Producto
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Cantidad
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Precio
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Subtotal
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Estado
                  </Typography>
                </TableCell>
                {state == "enviado" && (
                  <TableCell align="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Devuelto
                    </Typography>
                  </TableCell>
                )}
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentedItem.map((product, index) => (
                <TableRow
                  key={product.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    "&:last-child td": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          mr: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ mb: 0.5 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {product.id.slice(-8).toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="medium">
                      {product.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="primary.main"
                    >
                      ${product.price}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                    >
                      ${(product.price * product.quantity).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        PRODUCT_STATUS[product.state]?.label || product.status
                      }
                      color={PRODUCT_STATUS[product.state]?.color || "default"}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        minWidth: 100,
                      }}
                    />
                  </TableCell>
                  {state == "enviado" && (
                    <TableCell align="center">
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={
                            product.returnedQuantity === product.quantity
                              ? "success.main"
                              : product.returnedQuantity > 0
                              ? "warning.main"
                              : "text.secondary"
                          }
                        >
                          {product.returnedQuantity || 0}/{product.quantity}
                        </Typography>
                        {product.returnedQuantity > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(
                              (product.returnedQuantity / product.quantity) *
                                100
                            )}
                            % devuelto
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <IconButton
                      color="info"
                      size="small"
                      onClick={() => {
                        console.log("Eliminar producto:", product.id);
                        setopenEdit(true);
                        setSelectedProductTable(product);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        console.log("Eliminar producto:", product.id)
                      }
                    >
                      <Clear />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {/* Fila de total */}
              <TableRow
                sx={{
                  backgroundColor: "grey.50",
                  "& td": {
                    //py: 2,
                    borderTop: "2px solid",
                    borderColor: "divider",
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell colSpan={3} />
                <TableCell align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      background:
                        "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    Subtotal: ${total}
                  </Typography>
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} />
                <TableCell align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      background:
                        "linear-gradient(45deg, #FF5733 30%, #FFD700 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      fontWeight: "bold",
                    }}
                  >
                    Total: ${total * days}
                  </Typography>
                </TableCell>
                <TableCell align="center"></TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer informativo */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "grey.50",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                💡 Puede agregar o eliminar productos del alquiler
              </Typography>
            </Grid>
            <Grid item>
           
                <Button
                  variant="contained"
                
                  onClick={() => accept()}
                  disabled={state=="iniciado"?false:true}
                  sx={{
                   m:1,
                   
                    backgroundColor: "white",
                    color: "#FF5733",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      // transform: "translateY(-1px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Aceptar Pedido
                </Button>
    
                <Button
                 disabled={state=="aceptado"?false:true}
                  variant="contained"
                  
                  onClick={() => accept()}
                  sx={{
                          m:1,
                    backgroundColor: "white",
                    color: "#FF5733",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      // transform: "translateY(-1px)",
                      boxShadow: 3,
                    },
                  }}
                >
                Enviar Pedido
                </Button>
            <Button
                 disabled={state=="retorno"?false:true}
                  variant="contained"
             
                  onClick={() => accept()}
                  sx={{
                          m:1,
                    backgroundColor: "white",
                    color: "#FF5733",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      // transform: "translateY(-1px)",
                      boxShadow: 3,
                    },
                  }}
                >
                cerrar pedido
                </Button>
                <Button
             
                  variant="contained"
                  
                  onClick={() => accept()}
                  sx={{
                          m:1,
                    backgroundColor: "white",
                    color: "#FF5733",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      // transform: "translateY(-1px)",
                      boxShadow: 3,
                    },
                  }}
                >
                Guardar Cambios
                </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                📦 Total de productos: {rentedItem.length}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Diálogo para agregar productos */}
      <DialogProducts
        setProduct={setProduct}
        addProductDialog={addProductDialog}
        quantity={quantity}
        setQuantity={setQuantity}
        handleProductSelect={handleProductSelect}
        handleCloseDialog={handleCloseDialog}
        Inventory={Inventory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProduct={selectedProduct}
      />
      <DialogProductsExtra
        setProduct={setProduct}
        addProductDialog={openExtra}
        quantity={quantity}
        setQuantity={setQuantity}
        handleProductSelect={handleProductSelect}
        handleCloseDialog={handleCloseExtra}
        Inventory={Inventory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProduct={selectedProduct}
      />

      <EditProductTable
        open={openEdit}
        setProduct={setProduct}
        handleCloseDialog={setopenEdit}
        selectedProduct={selectedProductTable}
      />
    </Card>
  );
}
