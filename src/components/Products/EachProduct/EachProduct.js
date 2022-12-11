import React, { useContext } from "react";
import "./EachProduct.css";
import takaIcon from "../../../assets/icon/icons8-bangladesh-30.png";
import { AnnoorContext } from "../../../context/AnnoorContext";

const EachProduct = ({ product, setProductToShowDetails }) => {
  const { addToCart, removeFromCart, cart } = useContext(AnnoorContext);

  const productDetailsFromCart = cart.find((item) => item._id === product._id);

  return (
    <div className="each-product-container">
      <div className="each-products-upper-part">
        <img
          className="each-product-img"
          src={product.image}
          alt={product.name}
        />
        <div
          onClick={() => setProductToShowDetails(product)}
          className="product-name"
        >
          {product.name}
        </div>
        <div className="sub-text">{product.subtext}</div>
        <div className="price">
          <img className="taka-icon" src={takaIcon} alt="taka icon" />{" "}
          {product.price}
        </div>
      </div>

      <div className="card-action">
        {productDetailsFromCart ? (
          <div className="inc-and-dec-action">
            <div
              onClick={() => removeFromCart(product)}
              className="inc-and-dec-action-button"
            >
              <i class="fa-sharp fa-solid fa-minus"></i>
            </div>
            <div className="quantity-in-bag">
              {productDetailsFromCart.quantity} in bag
            </div>
            <div
              onClick={() => addToCart(product)}
              className="inc-and-dec-action-button"
            >
              <i class="fa-sharp fa-solid fa-plus"></i>
            </div>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="add-to-bag-button"
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
};

export default EachProduct;
