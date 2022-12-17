import {
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";
import PaymentModal from "../../PaymentModal/PaymentModal";

const EachOrderRow = ({ eachOrder, fetchOrders }) => {
  console.log(eachOrder);
  const [open, setOpen] = React.useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

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

  return (
    <>
      <TableRow>
        <TableCell align="center">{eachOrder?.orderId}</TableCell>
        <TableCell align="center" component="th" scope="row">
          {/* <Tooltip
            placement="top"
            title="The status will be changed to confirmed soon."
            arrow
          > */}
          <Box
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
          {/* </Tooltip> */}
        </TableCell>

        <TableCell align="center">{eachOrder?.total} tk</TableCell>
        <TableCell align="center">{eachOrder?.payment}</TableCell>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            color="primary"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                          {eachProduct.discount
                            ? eachProduct.price - eachProduct.discount
                            : eachProduct.price}{" "}
                          tk/
                          {eachProduct.subtext}
                        </TableCell>
                        <TableCell align="center">
                          {eachProduct.quantity}pcs
                        </TableCell>
                        <TableCell align="center">
                          {eachProduct.discount
                            ? (eachProduct.price - eachProduct.discount) *
                              eachProduct.quantity
                            : eachProduct.price * eachProduct.quantity}{" "}
                          tk
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
                {eachOrder.payment === "Cash On Delivery" &&
                  eachOrder.status !== "Confirmed" && (
                    <Button
                      onClick={() => setPaymentModalOpen(true)}
                      sx={{
                        marginBlock: "20px",
                        display: "block",
                        marginLeft: "auto",
                      }}
                      size="small"
                      variant="contained"
                    >
                      Change Payment
                    </Button>
                  )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {paymentModalOpen && (
        <PaymentModal
          fetchOrders={fetchOrders}
          totalPayable={eachOrder?.total}
          orderId={eachOrder.orderId}
          paymentModalOpen={paymentModalOpen}
          setPaymentModalOpen={setPaymentModalOpen}
        />
      )}
    </>
  );
};

export default EachOrderRow;
