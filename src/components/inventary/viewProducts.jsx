import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";


export default function ViewProducts({products,getAvailableStock,getStockColor,getConditionColor,handleOpenDialog,handleOpenDeleteDialog}) {
  return (
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
              <strong>Precio/Perdida</strong>
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
                <Typography variant="subtitle2">{product.name}</Typography>
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
                <Chip label={product.rented} color="secondary" size="small" />
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
                <Typography variant="body2">{product.priceLost}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{product.extra===true?"SI":"NO"}</Typography>
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
  );
}
