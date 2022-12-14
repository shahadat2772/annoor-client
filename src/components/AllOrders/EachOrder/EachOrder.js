import {
  Box,
  Button,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";

const EachOrder = ({ fetchOrders, eachOrder }) => {
  const [open, setOpen] = React.useState(false);
  const [orderStatusPopupAncEl, setOrderStatusPopupAncEl] = useState(null);
  const orderStatusUpdatePopupOpen = Boolean(orderStatusPopupAncEl);
  const { userInfo } = useContext(AuthContext);

  const closeOrderStatusPopup = () => {
    setOrderStatusPopupAncEl(null);
  };

  let bg;
  if (eachOrder.status === "Processing") {
    bg = "secondary.main";
  }
  if (eachOrder.status === "Confirmed" || eachOrder.status === "Delivered") {
    bg = "success.light";
  }
  if (eachOrder.status === "Canceled") {
    bg = "error.light";
  }

  const updateOrderStatus = (status) => {
    if (status === eachOrder.status) {
      closeOrderStatusPopup();
      return;
    }

    const updatedOrderStatus = {
      status: status,
    };

    console.log(updatedOrderStatus);

    fetch("http://localhost:5000/order-status", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        uid: userInfo.uid,
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        id: eachOrder.orderId,
      },
      body: JSON.stringify(updatedOrderStatus),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          fetchOrders();
          closeOrderStatusPopup();
          toast.success(result?.message);
        } else {
          toast.error(result?.message);
        }
      });
  };

  const deleteOrder = () => {
    Swal.fire({
      icon: "warning",
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Yes",
      html: "<div><p>Are you sure you wanna <br/> delete this order?</p></div>",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:5000/delete-order", {
          method: "DELETE",
          headers: {
            id: eachOrder.orderId,
            uid: userInfo.uid,
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              toast.success(result?.message, {
                id: "productDeleted",
              });
              fetchOrders();
            } else {
              toast.error(result?.message, {
                id: "productDeleted",
              });
            }
          });
      }
    });
  };

  return (
    <>
      <TableRow>
        <TableCell align="center">{eachOrder?.date}</TableCell>
        <TableCell align="center">{eachOrder?.orderId}</TableCell>
        <TableCell align="center" component="th" scope="row">
          <Box
            onClick={(e) => setOrderStatusPopupAncEl(e.currentTarget)}
            sx={{
              backgroundColor: bg,
              borderRadius: "5px",
              padding: "2px",
              cursor: "pointer",
              color: "white",
            }}
          >
            {eachOrder.status}
          </Box>
        </TableCell>

        <TableCell align="center">{eachOrder?.total} tk</TableCell>
        <TableCell align="center">{eachOrder?.payment}</TableCell>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            color="primary"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ marginRight: "7px" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <IconButton
            aria-label="expand row"
            color="primary"
            size="small"
            onClick={() => deleteOrder()}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            padding: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ marginBlock: 1 }}>
              <div className="ordered-product-table-container">
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {eachOrder?.products?.map((eachProduct) => (
                      <TableRow key={eachProduct._id}>
                        <TableCell align="center">
                          <img
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                            src={eachProduct.image}
                            alt={eachProduct.name}
                          />
                        </TableCell>
                        <TableCell align="center">{eachProduct.name}</TableCell>
                        <TableCell align="center">
                          {eachProduct.price} tk/
                          {eachProduct.subtext}
                        </TableCell>
                        <TableCell align="center">
                          {eachProduct.quantity}pcs
                        </TableCell>
                        <TableCell align="center">
                          {eachProduct.price * eachProduct.quantity} tk
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Box sx={{ paddingInline: "10px", paddingBottom: "7px" }}>
                <div style={{ marginTop: "6px" }} className="shipping-details">
                  <p className="shipping-details-header">Address</p>
                  <div style={{ marginTop: "3px" }} className="address">
                    <p>{eachOrder?.address}</p>
                    <p>{eachOrder?.phoneNumber}</p>
                  </div>
                </div>
                {eachOrder.transactionId && (
                  <Typography sx={{ marginTop: "5px" }}>
                    TrxID: {eachOrder.transactionId}
                  </Typography>
                )}
                {/* <Button
                  onClick={() => deleteOrder()}
                  sx={{
                    marginBlock: "20px",
                    display: "block",
                    marginLeft: "auto",
                  }}
                  size="small"
                  variant="contained"
                  color="error"
                >
                  DELETE ORDER
                </Button> */}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* ------Order status update popup----- */}
      <Menu
        anchorEl={orderStatusPopupAncEl}
        open={orderStatusUpdatePopupOpen}
        onClose={closeOrderStatusPopup}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => updateOrderStatus("Processing")}>
          Processing
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus("Confirmed")}>
          Confirmed
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus("Delivered")}>
          Delivered
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus("Canceled")}>
          Canceled
        </MenuItem>
      </Menu>
    </>
  );
};

export default EachOrder;
