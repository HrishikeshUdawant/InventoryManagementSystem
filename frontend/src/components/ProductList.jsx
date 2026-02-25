import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function ProductList({ products, refresh }) {
  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    refresh();
  };

  return (
    <TableContainer component={Paper} elevation={3}>
      <Typography
        variant="h6"
        align="center"
        sx={{ py: 2 }}
        fontWeight={600}
      >
        Product List
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Qty</b></TableCell>
            <TableCell><b>Price</b></TableCell>
            <TableCell><b>Category</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.qty}</TableCell>
              <TableCell>₹{p.price}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  onClick={() => deleteProduct(p._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductList;
