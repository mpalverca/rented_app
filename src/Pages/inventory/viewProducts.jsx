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
  Preview,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewProducts({
  products,
  handleOpenDialog,
  handleOpenDeleteDialog,
}) {
 const navigate = useNavigate();
  const { storeId } = useParams();
    const handleViewDetails = (rentedId) => {
    navigate(`/my_store/${storeId}/inventary/edit_product/${rentedId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Producto</strong>
            </TableCell>
            <TableCell>
              <strong>Imagen</strong>
            </TableCell>
            <TableCell>
              <strong>Agregado Por</strong>
            </TableCell>
            
            <TableCell>
              <strong>Subproductos</strong>
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
              {/* <TableCell>
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
              </TableCell> */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                 <img
  src={product?.image?.[0] || "/images/default-product.png"}
  alt={product?.name || "Producto"}
  style={{ width: "100px", height: "auto", objectFit: "cover" }}
/>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                  {product.addedBy}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={product.suproducts?.length || 0}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={product.extra === true ? "Sí" : "No"}
                  //  color={product.extra===true ? "blue" : "red"}
                  //variant="outlined"
                  size="small"
                />
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
                    <Preview />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() =>   handleViewDetails(product.id)}
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
