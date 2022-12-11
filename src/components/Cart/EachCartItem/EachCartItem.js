import React, { useContext } from "react";
import "./EachCartItem.css";
import takaIcon from "../../../assets/icon/icons8-bangladesh-30.png";
import { AnnoorContext } from "../../../context/AnnoorContext";

const EachCartItem = ({ eachCartItem }) => {
  const { addToCart, removeFromCart, deleteFromCart } =
    useContext(AnnoorContext);

  const { image, name, quantity, subtext, price } = eachCartItem;
  return (
    <div className="each-cart-item-container">
      <div className="quantity">
        <span
          onClick={() => addToCart(eachCartItem)}
          className="quantity-update-button"
        >
          <i class="fa-solid fa-angle-up"></i>
        </span>
        <span className="item-quantity">{quantity}</span>
        <span
          onClick={() => removeFromCart(eachCartItem)}
          className="quantity-update-button"
        >
          <i class="fa-solid fa-angle-down"></i>
        </span>
      </div>
      <div className="name-and-img">
        <img className="each-cart-items-img" src={image} alt="" />
        <div className="name-and-unit-price">
          <span className="cart-item-name">{name}</span>
          <div className="price-per-unit">
            <img
              className="taka-icon-in-unit-price"
              src={takaIcon}
              alt="taka icon"
            />{" "}
            <span>{price}</span>/<span>{subtext}</span>
          </div>
        </div>
      </div>

      <div className="total">
        <span className="total-amount">
          <img
            className="taka-icon-in-cart-item"
            src={takaIcon}
            alt="taka icon"
          />{" "}
          <span>{price * quantity}</span>
        </span>
        <span
          onClick={() => deleteFromCart(eachCartItem)}
          className="close-button"
        >
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
    </div>
  );
};

export default EachCartItem;
