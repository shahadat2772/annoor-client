import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import EachProduct from "./EachProduct/EachProduct";
import ProductDetailsModal from "./ProductDetailsModal/ProductDetailsModal";
import "./Products.css";
import Loading from "../Loading/Loading.js";
import { Typography } from "@mui/material";

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [productToShowDetails, setProductToShowDetails] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    setProductLoading(true);
    fetch(`http://localhost:5000/product`, {
      headers: {
        category: category ? category : "snacks",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProductLoading(false);
        setProducts(result.data);
      });
  }, [category]);

  return (
    <React.Fragment>
      <div className="products-container">
        <div className="category-header">
          <span>{category ? category : "Food"}</span>
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
