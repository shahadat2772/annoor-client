import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "./AddProduct.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { userInfo } = useContext(AuthContext);
  const [productImg, setProductImg] = useState(null);
  const [description, setDescription] = useState(() =>
    EditorState.createEmpty()
  );
  const descriptionHtml = draftToHtml(
    convertToRaw(description.getCurrentContent())
  );

  const handleImgSelection = (e) => {
    setProductImg(e?.target?.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const image = e.target.image.files[0];
    const name = e.target.name.value;
    const category = e.target.category.value;
    const subtext = e.target.subtext.value;
    const price = e.target.price.value;
    const discount = e.target.discount.value;
    const stock = e.target.stock.value;
    const description = descriptionHtml;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("subtext", subtext);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("description", description);

    fetch("https://annoor-server-production-af32.up.railway.app/product", {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        uid: userInfo?.uid,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message, {
            id: "productadded",
          });
        } else {
          toast.error(result.message, {
            id: "productadded",
          });
        }
      });
  };

  return (
    <div>
      <div className="cart-header">
        <span>Add Product</span>
      </div>

      <div className="add-product-form-container">
        {productImg && (
          <img
            style={{ width: "100px" }}
            src={URL.createObjectURL(productImg)}
            alt=""
          />
        )}
        <form onSubmit={(e) => onSubmit(e)} className="add-product-form">
          <label className="add-product-input-label">Image</label>
          <input
            required
            className="add-product-input add-product-img-input"
            accept=".png,.jpeg,.jpg"
            type="file"
            placeholder="Name"
            name="image"
            onChange={(e) => handleImgSelection(e)}
          />
          <label className="add-product-input-label">Name</label>
          <input
            required
            className="add-product-input"
            type="text"
            placeholder="Name"
            name="name"
          />
          <label className="add-product-input-label">Category</label>
          <input
            required
            className="add-product-input"
            type="text"
            placeholder="Category"
            name="category"
          />
          <label className="add-product-input-label">Subtext</label>
          <input
            required
            className="add-product-input"
            type="text"
            placeholder="Subtext"
            name="subtext"
          />
          <label className="add-product-input-label">Price</label>
          <input
            required
            className="add-product-input"
            type="number"
            placeholder="Price"
            name="price"
          />
          <label className="add-product-input-label">Discount</label>
          <input
            className="add-product-input"
            type="number"
            placeholder="Discount"
            name="discount"
          />
          <label className="add-product-input-label">Stock</label>
          <input
            required
            className="add-product-input"
            type="number"
            placeholder="Stock"
            name="stock"
          />
          <label className="add-product-input-label">Details</label>
          <Editor
            required={true}
            editorState={description}
            onEditorStateChange={setDescription}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class border text-light post-editor border-0 editor-class-name shareInput"
            toolbarClassName="toolbar-class"
            toolbarHidden
          />
          <Button
            sx={{ marginTop: "8px", marginBottom: "40px" }}
            type="submit"
            variant="contained"
          >
            Add Product
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
