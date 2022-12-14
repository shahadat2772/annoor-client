import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Loading/Loading";
import EachOrder from "./EachOrder/EachOrder";

const AllOrders = () => {
  const { userInfo } = useContext(AuthContext);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const pageCount = Math.ceil(orderCount / 15);

  const fetchOrders = () => {
    setOrdersLoading(true);
    fetch(`http://localhost:5000/all-orders?page=${pageNumber}`, {
      headers: {
        uid: userInfo.uid,
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setOrderCount(result.orderCount);
          setOrders(result.data);
          setOrdersLoading(false);
        } else {
          toast.error(result?.message);
          setOrdersLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo, pageNumber]);

  return (
    <div>
      <div style={{ paddingBottom: "10px" }} className="cart-header">
        <span>All Orders</span>
      </div>

      <div className="myOrders">
        <Box sx={{ marginInline: "auto" }}>
          {ordersLoading && <Loading />}

          {ordersLoading === false && orders?.length > 0 && (
            <Table size="small" aria-label="collapsible table">
              <TableHead>
                <TableRow border>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Payment</TableCell>
                  <TableCell align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((eachOrder) => (
                  <EachOrder fetchOrders={fetchOrders} eachOrder={eachOrder} />
                ))}
              </TableBody>
            </Table>
          )}

          {!ordersLoading && !orders.length > 0 && (
            <div>
              <Typography textAlign={"center"} marginTop="152px" variant="h5">
                No orders found :(
              </Typography>
            </div>
          )}
        </Box>
      </div>

      {pageCount > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "20px",
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

export default AllOrders;
