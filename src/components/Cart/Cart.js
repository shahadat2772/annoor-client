import { Typography } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { AnnoorContext } from "../../context/AnnoorContext";
import "./Cart.css";
import EachCartItem from "./EachCartItem/EachCartItem";
import EmptyCartImg from "../../assets/imgs/empy-cart.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Cart = () => {
  const { cart } = useContext(AnnoorContext);
  const { userInfo } = useContext(AuthContext);

  const navigate = useNavigate();

  let addedItems = 0;
  let totalPrice = 0;
  cart.forEach((item) => {
    addedItems = addedItems + item.quantity;
    totalPrice = totalPrice + item.price * item.quantity;
  });

  let totalShipping = 30;
  // let totalTax = totalPrice * 0.01;
  // let grandTotal = totalPrice + totalTax + totalShipping;
  let grandTotal = totalPrice + totalShipping;

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
          <button disabled={cart.length === 0} className="checkout-button">
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
