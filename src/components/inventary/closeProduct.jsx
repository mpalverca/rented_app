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
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  productService,
  getAllProductItems,
} from "../../services/productServices";
export default function CloseProduct({
  handleCloseDeleteDialog,
  selectedProduct,
  openDeleteDialog,
  handleDeleteProduct,
}) {
  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar el producto "
          {selectedProduct?.name}"?
        </Typography>
        {selectedProduct?.rented > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            No se puede eliminar porque tiene {selectedProduct.rented} unidades
            alquiladas
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
  );
}
