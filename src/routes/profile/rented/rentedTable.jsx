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
  Divider,
} from "@mui/material";
import React from "react";

const PRODUCT_STATUS = {
  alquilado: { label: "Alquilado", color: "primary" },
  devuelto: { label: "Devuelto", color: "success" },
  pendiente: { label: "Pendiente", color: "warning" },
};

export default function RentedTable({
  rentedItem,
  total,
  AssignmentReturn,
  setReturnDialog,
  state,
}) {
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
          my: 2,
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              📦 Productos Alquilados
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {rentedItem.length} productos en alquiler
            </Typography>
          </Grid>
          <Grid item>
            {state == "enviado" ? (
              <Button
                variant="contained"
                startIcon={<AssignmentReturn />}
                onClick={() => setReturnDialog(true)}
                sx={{
                  backgroundColor: "white",
                  color: "#FF5733",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: 3,
                  },
                }}
              >
                Devolver Productos
              </Button>
            ) : (
              <></>
            )}
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
                {state == "enviado" ? (
                  <TableCell align="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Devuelto
                    </Typography>
                  </TableCell>
                ) : (
                  <></>
                )}
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
                  {rentedItem.state == "enviado" ? (
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
                  ) : (
                    <></>
                  )}
                </TableRow>
              ))}

              {/* Fila de total */}
              <TableRow
                sx={{
                  backgroundColor: "grey.50",
                  "& td": {
                    py: 2,
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
                    Total: ${total}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} />
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
                💡 Puede devolver productos parcial o totalmente
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                📦 Total de productos: {rentedItem.length}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
