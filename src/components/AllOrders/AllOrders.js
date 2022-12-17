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
  const [filterBy, setFilterBy] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const pageCount = Math.ceil(orderCount / 15);

  const fetchOrders = () => {
    setOrdersLoading(true);
    fetch(
      `https://annoor-server-production-af32.up.railway.app/all-orders?page=${pageNumber}&filter=${filterBy}`,
      {
        headers: {
          uid: userInfo.uid,
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
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
  }, [userInfo, pageNumber, filterBy]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          paddingInline: "5px",
        }}
      >
        <div style={{ paddingBottom: "10px" }} className="cart-header">
          <span>All Orders</span>
        </div>
        <select onChange={(e) => setFilterBy(e.target.value)}>
          <option value="">Filter</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </Box>

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
