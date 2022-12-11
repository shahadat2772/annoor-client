import { Dialog, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import "./ProductDetailsModal.css";
import takeIcon from "../../../assets/icon/icons8-bangladesh-30.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { AnnoorContext } from "../../../context/AnnoorContext";

const ProductDetailsModal = ({
  productToShowDetails,
  setProductToShowDetails,
}) => {
  const { name, price, image, subtext, details, _id, description } =
    productToShowDetails;
  const { cart, addToCart, removeFromCart } = useContext(AnnoorContext);
  const productDetailsFromCart = cart.find((product) => product._id === _id);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        className="product-details-modal"
        scroll="body"
        open={productToShowDetails !== null}
        onClose={() => setProductToShowDetails(null)}
      >
        <div className="details-container">
          <IconButton
            aria-label="close"
            onClick={() => setProductToShowDetails(null)}
            size="small"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[600],
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className="image">
            <img src={image} alt="product img" />
          </div>
          <div className="details">
            <div className="name-and-subtext">
              <Typography
                sx={{
                  marginBottom: "2px",
                  marginRight: { sm: "0px", md: "35px" },
                }}
                variant="h5"
              >
                {name}
              </Typography>
              <span className="sub-text-in-product-details">{subtext}</span>
            </div>
            <div className="price-container">
              <span>
                <img
                  className="taka-icon-in-product-details"
                  src={takeIcon}
                  alt="taka icon"
                />
              </span>
              <span className="price-in-product-details">{price}</span>
            </div>
            <div className="add-to-cart">
              <div
                onClick={() => removeFromCart(productToShowDetails)}
                className="quantity-control-button"
              >
                <i class="fa-sharp fa-solid fa-minus"></i>
              </div>
              <div className="quantity-in-detail-modal">
                <div className="quantity-main">
                  <span>
                    {productDetailsFromCart
                      ? productDetailsFromCart.quantity
                      : 0}
                  </span>
                </div>
                <div className="in-bag">in bag</div>
              </div>
              <div
                onClick={() => addToCart(productToShowDetails)}
                className="quantity-control-button"
              >
                <i class="fa-sharp fa-solid fa-plus"></i>
              </div>
            </div>
            <Divider sx={{ margin: "20px" }} />
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="product-details-container"
            ></div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductDetailsModal;
