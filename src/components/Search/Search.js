import { Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import EachProduct from "../Products/EachProduct/EachProduct";
import ProductDetailsModal from "../Products/ProductDetailsModal/ProductDetailsModal";

const Search = () => {
  const { searchQuery } = useParams();
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToShowDetails, setProductToShowDetails] = useState(null);

  useEffect(() => {
    if (searchQuery !== "") {
      setProductLoading(true);
      fetch(
        `https://annoor-server-production-af32.up.railway.app/products?search=${searchQuery}`
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setProducts(result?.data);
            setProductLoading(false);
          } else {
            toast.error(result.message, {
              id: "searchResultToast",
            });
            setProductLoading(false);
          }
        });
    }
  }, [searchQuery]);

  return (
    <div>
      <Typography sx={{ color: "gray", marginTop: "4px", marginLeft: "4px" }}>
        Search result for "{searchQuery}"
      </Typography>

      <div className="search-result-container">
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
    </div>
  );
};

export default Search;
