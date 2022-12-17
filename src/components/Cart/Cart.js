import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useContext } from "react";
import { AnnoorContext } from "../../context/AnnoorContext";
import "./Cart.css";
import EachCartItem from "./EachCartItem/EachCartItem";
import EmptyCartImg from "../../assets/imgs/empy-cart.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { cart, setCart } = useContext(AnnoorContext);
  const { userInfo } = useContext(AuthContext);
  const date = new Date();
  const formattedDate = `${
    date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
  }`;

  const navigate = useNavigate();

  let addedItems = 0;
  let totalPrice = 0;
  let totalDiscount = 0;
  cart.forEach((item) => {
    addedItems = addedItems + item.quantity;
    totalPrice = totalPrice + item.price * item.quantity;
    totalDiscount = totalDiscount + item?.discount * item.quantity;
  });

  let totalShipping = 30;
  let grandTotal = totalPrice - totalDiscount + totalShipping;

  const placeOrder = () => {
    if (!userInfo.address || !userInfo.phoneNumber) {
      toast.error("Please provide the required information to proceed.");
      navigate("/profile");
      return;
    }

    const order = {
      uid: userInfo.uid,
      userName: userInfo.name,
      address: userInfo.address,
      phoneNumber: userInfo.phoneNumber,
      products: cart,
      status: "Processing",
      payment: "Cash On Delivery",
      total: grandTotal,
      date: formattedDate,
    };

    fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        uid: userInfo?.uid,
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setCart([]);
          navigate("/orders");
          toast.success("Order placed successfully.");
        } else {
          toast.error(result?.message);
        }
      });
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <span>Cart</span>
      </div>
      <div className="cart-container">
        <div className="cart-items">
          {cart.length > 0 ? (
            cart.map((eachCartItem) => (
              <EachCartItem eachCartItem={eachCartItem} />
            ))
          ) : (
            <img className="empty-cart-img" src={EmptyCartImg} alt="" />
          )}
        </div>
        <div className="order-summery">
          <Typography variant="h6">Order Summary</Typography>
          <div className="check-out-details">
            <p>Items: {addedItems}</p>
            <p>Subtotal: {totalPrice}</p>
            {cart.length > 0 && <p>Shipping: {totalShipping}</p>}
            {cart.length > 0 && <p>Total: {grandTotal}</p>}
            {/* <p>Tax: {totalTax}</p> */}
          </div>
          <div className="shipping-details">
            <p className="shipping-details-header">Address --</p>
            <div onClick={() => navigate("/profile")} className="address">
              {userInfo?.phoneNumber && userInfo?.address ? (
                <>
                  <p>{userInfo?.address}</p>
                  <p>{userInfo?.phoneNumber}</p>
                </>
              ) : (
                <p className="provide-address-message">
                  Provide address and number
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => placeOrder()}
            disabled={cart.length === 0}
            className="checkout-button"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
