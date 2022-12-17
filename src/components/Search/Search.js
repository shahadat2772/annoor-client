import { Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const Search = () => {
  const { searchQuery } = useParams();
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (searchQuery !== "") {
      setProductLoading(true);

      fetch(`http://localhost:5000/products?seach=${searchQuery}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setProducts(result?.data);
            setProductLoading(false);
          } else {
            toast.error(result.message);
            setProductLoading(false);
          }
        });
    }
  }, [searchQuery]);

  return (
    <div>
      <Typography>This is search page {searchQuery}</Typography>
    </div>
  );
};

export default Search;
