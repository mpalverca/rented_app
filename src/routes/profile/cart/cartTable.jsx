// components/Cart.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";

export default function CartTable({
  cartItems,
  updateQuantity,
  calculateProductSubtotal,
  rentalDays,
  removeFromCart,
  subtotal,
  userId,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>Precio por Día</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Tiempo</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1" sx={{ py: 3 }}>
                  No hay productos en el carrito
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            cartItems.map((product) => {
              console.log("Renderizando producto:", product);
              //const productsDetails = await productService.getProductItemById(product);
              return (
                <TableRow key={product.id}>
                  <TableCell sx={{maxWidth:"200px"}}>
                    <Typography variant="body1" fontWeight="medium">
                      {product.name}- {product.subproducto.name}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{maxWidth:"50px"}}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "grey.200",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          No image
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: "50px" }}>
                    <Typography variant="body1">
                      ${product.subproducto.price?.toFixed(2) || "0.00"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: "100px" }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {/* Controles de cantidad */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              (product.quantity || 1) - 1,
                            )
                          }
                        >
                          <Remove />
                        </IconButton>

                        <Typography
                          variant="body1"
                          sx={{ minWidth: 30, textAlign: "center" }}
                        >
                          {product.quantity || 1}
                        </Typography>

                        <IconButton
                        disabled={product.subproducto?.stock <= (product.quantity || 1)}
                          size="small"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              (product.quantity || 1) + 1,
                            )
                          }
                        >
                          <Add />
                        </IconButton>
                      </Box>

                      {/* Alert debajo */}
                      {product.subproducto?.stock < (product.quantity || 1) && (
                        <Alert
                          severity="warning"
                          // variant="outlined"
                          size="small"
                        >
                          ¡Stock insuficiente!
                        </Alert>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: "100px" }}>
                    
                     
                       {!rentalDays ?
                        <Alert
                          severity="warning"
                          // variant="outlined"
                          size="small"
                        >
                          Seleccione dias de Uso
                        </Alert>: <Typography>{rentalDays } dias </Typography>
                      }
                  </TableCell >
                  <TableCell sx={{ maxWidth: "100px" }}>
                    <Typography variant="body1" fontWeight="medium">
                      $
                      {calculateProductSubtotal({
                        quantity: product.quantity,
                        price: product.subproducto.price,
                      }).toFixed(2)}
                    </Typography>
                    {/* <Typography variant="caption" color="text.secondary">
                      ({rentalDays} días × {product.quantity || 1} unidades)
                    </Typography> */}
                  </TableCell>

                  <TableCell sx={{ maxWidth: "20px" }}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que quieres eliminar este producto del carrito?",
                          )
                        ) {
                          removeFromCart(userId, product.id);
                          alert("Producto eliminado del carrito");
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">
              <Typography variant="h5" fontWeight="medium">
                {subtotal}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
