import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import "./PaymentModal.css";

const PaymentModal = ({
  paymentModalOpen,
  setPaymentModalOpen,
  orderId,
  totalPayable,
  fetchOrders,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [tnxId, setTnxId] = useState("");
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    setTnxId("");
  }, [paymentMethod]);

  const handlePayment = (e) => {
    e.preventDefault();

    if (paymentMethod === "bkash") {
      if (tnxId.length !== 10) {
        return toast.error("Invalid transaction id.");
      }
    }

    if (paymentMethod === "rocket") {
      if (tnxId.length !== 9) {
        return toast.error("Invalid transaction id.");
      }
    }

    const payment = {
      payment: `Paid with ${paymentMethod}`,
      paymentMethod: paymentMethod,
      transactionId: tnxId,
    };

    fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        uid: userInfo.uid,
        id: orderId,
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payment),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setPaymentModalOpen(false);
          fetchOrders();
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={paymentModalOpen}
      onClose={() => setPaymentModalOpen(false)}
    >
      <Box sx={{ padding: "20px", position: "relative" }}>
        <IconButton
          size="small"
          onClick={() => setPaymentModalOpen(false)}
          sx={{ position: "absolute", top: "6px", right: "6px" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography sx={{ fontSize: "18px" }} marginBottom={1.5} variant="h6">
          Total Payable: {totalPayable}TK (Inc VAT)
        </Typography>

        <form onSubmit={handlePayment}>
          <FormControlLabel
            control={
              <Checkbox
                checked={paymentMethod === "bkash"}
                onChange={(e) => setPaymentMethod(e.target.name)}
                name="bkash"
              />
            }
            label="01821606828 (Bkash Marchent)"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={paymentMethod === "rocket"}
                onChange={(e) => setPaymentMethod(e.target.name)}
                name="rocket"
              />
            }
            label="018216068283 (Rocket Marchent)"
          />
          <TextField
            sx={{ marginTop: 1 }}
            type={paymentMethod === "bkash" ? "text" : "number"}
            name="transactionId"
            fullWidth
            size="small"
            label="Transaction ID"
            variant="outlined"
            className="transactionIdInput"
            required
            value={tnxId}
            onChange={(e) => setTnxId(e.target.value.toLocaleUpperCase())}
          />
          <Button
            sx={{ marginTop: "15px", display: "block", marginLeft: "auto" }}
            size="small"
            variant="contained"
            type="submit"
          >
            PAY
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default PaymentModal;
