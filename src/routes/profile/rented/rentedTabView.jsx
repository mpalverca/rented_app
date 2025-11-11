import {
  Button,
  Card,
  CardContent,
  TableContainer,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function RentedTabView({product}) {
  return (
    <>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Productos Alquilados</Typography>
            <Button
              variant="contained"
              startIcon={<AssignmentReturn />}
              onClick={() => setReturnDialog(true)}
            >
              Devolver Productos
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Precio</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Devuelto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            mr: 2,
                            borderRadius: 1,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">${product.price}</TableCell>
                    <TableCell align="center">
                      ${(product.price * product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          PRODUCT_STATUS[product.status]?.label ||
                          product.status
                        }
                        color={
                          PRODUCT_STATUS[product.status]?.color || "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.returnedQuantity || 0}/{product.quantity}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} />
                  <TableCell align="center">
                    <Typography variant="h6" color="primary">
                      Total: ${rentedItem.total}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
