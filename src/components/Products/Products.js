import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import EachProduct from "./EachProduct/EachProduct";
import ProductDetailsModal from "./ProductDetailsModal/ProductDetailsModal";
import "./Products.css";
import Loading from "../Loading/Loading.js";
import { Typography } from "@mui/material";
import Marquee from "react-smooth-marquee";
import { toast } from "react-hot-toast";

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [productToShowDetails, setProductToShowDetails] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [offerText, setOfferText] = useState("");

  useEffect(() => {
    setProductLoading(true);
    fetch(`https://annoor-server-production-af32.up.railway.app/product`, {
      headers: {
        category: category ? category : "grocery",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProductLoading(false);
        setProducts(result.data);
      });
  }, [category]);

  const fetchOffer = () => {
    fetch("https://annoor-server-production-af32.up.railway.app/get-offer")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setOfferText(result?.data?.offerText);
        } else {
          toast.error(result?.message, {
            id: "offer-updated",
          });
        }
      });
  };

  useEffect(() => {
    fetchOffer();
  }, []);

  return (
    <React.Fragment>
      {offerText !== "" && <Marquee>{offerText}</Marquee>}
      <div className="products-container">
        <div className="category-header">
          <span>{category ? category : "Grocery"}</span>
        </div>
        {!productLoading ? (
          <div className="products">
            {products.length > 0 ? (
              products.map((product) => (
                <EachProduct
                  product={product}
                  key={product._id}
                  productToShowDetails={productToShowDetails}
                  setProductToShowDetails={setProductToShowDetails}
                />
              ))
            ) : (
              <div>
                <Typography textAlign={"center"} marginTop="152px" variant="h5">
                  No items found :(
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Product details modal */}
      {productToShowDetails && (
        <ProductDetailsModal
          productToShowDetails={productToShowDetails}
          setProductToShowDetails={setProductToShowDetails}
        />
      )}
    </React.Fragment>
  );
};

export default Products;
