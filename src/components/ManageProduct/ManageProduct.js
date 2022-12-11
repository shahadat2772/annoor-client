import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loading from "../Loading/Loading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./ManageProduct.css";
import SearchIcon from "@mui/icons-material/Search";

const ManageProduct = () => {
  const { userInfo } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  console.log(pageNumber, "page number");
  const [searchQuery, setSearchQuery] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const pageCount = Math.ceil(productCount / 15);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userInfo) {
  //     fetch("https://annoor-server-production-af32.up.railway.app/product-count", {
  //       headers: {
  //         uid: userInfo.uid,
  //         authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         if (result.success) {
  //           setProductCount(result.data);
  //         } else {
  //           toast.error(result.message);
  //         }
  //       });
  //   }
  // }, [userInfo]);

  const fetchAllProducts = () => {
    if (userInfo) {
      setProductLoading(true);
      fetch(
        `https://annoor-server-production-af32.up.railway.app/all-products?page=${pageNumber}&search=${searchQuery}`,
        {
          headers: {
            uid: userInfo.uid,
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            setProducts(result.data);
            setProductLoading(false);
            setProductCount(result.productCount);
          } else {
            toast.error(result.message);
            setProductLoading(false);
          }
        });
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [userInfo, pageNumber]);

  const handleSearch = (e) => {
    fetchAllProducts();
  };

  const deleteProduct = (_id) => {
    Swal.fire({
      icon: "warning",
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Yes",
      html: "<div><p>Are you sure you wanna <br/> delete this product?</p></div>",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          "https://annoor-server-production-af32.up.railway.app/delete-product",
          {
            method: "DELETE",
            headers: {
              uid: userInfo.uid,
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              _id: _id,
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              toast("Product deleted.", {
                id: "ProductDeletedId",
              });
              fetchAllProducts();
            } else {
              toast.error(result.message, {
                id: "ProductDeletedId",
              });
              fetchAllProducts();
            }
          });
      }
    });
  };

  return (
    <div>
      <div>
        <div style={{ paddingBottom: "10px" }} className="cart-header">
          <span>Manage Products</span>
        </div>
        <div className="product-manage-search-bar-container">
          <form className="search-bar-container">
            <input
              placeholder="Search product by name"
              type="text"
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-button-container">
              <Button
                onClick={() => handleSearch()}
                size="small"
                sx={{
                  minWidth: 0,
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  height: "100%",
                }}
              >
                <SearchIcon />
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="manage-products-container">
        {productLoading && <Loading />}
        {productLoading === false && products?.length > 0 && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">Sl.</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((eachProduct, index) => (
                  <TableRow
                    key={eachProduct?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" component="th" scope="row">
                      {(pageNumber - 1) * 15 + index + 1}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={eachProduct?.image}
                        alt=""
                      />
                    </TableCell>
                    <TableCell align="left">{eachProduct?.name}</TableCell>
                    <TableCell align="center">{eachProduct?.stock}</TableCell>
                    <TableCell align="center">{eachProduct?.price}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          navigate(`/admin/edit-product/${eachProduct._id}`)
                        }
                        color="primary"
                        sx={{ marginRight: "8px", cursor: "pointer" }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="primary"
                        sx={{ marginLeft: "8px", cursor: "pointer" }}
                        size="small"
                        onClick={() => deleteProduct(eachProduct._id)}
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!productLoading && !products.length > 0 && (
          <div>
            <Typography textAlign={"center"} marginTop="152px" variant="h5">
              No items found :(
            </Typography>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Pagination
            color="primary"
            onChange={(e, value) => setPageNumber(value)}
            page={pageNumber}
            count={pageCount}
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
};

export default ManageProduct;
