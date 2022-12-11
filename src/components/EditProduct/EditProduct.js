import { Button } from "@mui/material";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";

const EditProduct = () => {
  const { userInfo } = useContext(AuthContext);
  const param = useParams();
  const _id = param?._id;

  const [productImageUpdated, setProductImageUpdated] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subtext, setSubtext] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState(() =>
    EditorState.createEmpty()
  );
  console.log(description);

  useEffect(() => {
    if (_id) {
      fetch(
        "https://annoor-server-production-af32.up.railway.app/single-product",
        {
          headers: {
            uid: userInfo?.uid,
            _id: _id,
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            const product = result?.data;
            setImageUrl(product?.image);
            setName(product?.name);
            setCategory(product?.category);
            setSubtext(product?.subtext);
            setPrice(product?.price);
            setStock(product?.stock);
            console.log(product?.description);
            const productDescriptionDraft = htmlToDraft(product?.description);
            const contentBlock = productDescriptionDraft?.contentBlocks;
            const entityMap = productDescriptionDraft?.entityMap;
            const descriptionContentState = ContentState.createFromBlockArray(
              contentBlock,
              entityMap
            );
            setDescription(
              EditorState.createWithContent(descriptionContentState)
            );
          } else {
            toast.error(result.message);
          }
        });
    }
  }, [_id]);

  const handleImgSelection = (e) => {
    if (e?.target?.files[0]) {
      setProductImageUpdated(true);
      setImage(e?.target?.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage("");
      setImageUrl("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const descriptionHtml = draftToHtml(
      convertToRaw(description.getCurrentContent())
    );

    const formData = new FormData();
    if (productImageUpdated) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("category", category);
    formData.append("subtext", subtext);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", descriptionHtml);

    fetch("https://annoor-server-production-af32.up.railway.app/edit-product", {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        uid: userInfo?.uid,
        _id: _id,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message, {
            id: "productUpdated",
          });
        } else {
          toast.error(result.message, {
            id: "productUpdated",
          });
        }
      });
  };

  return (
    <div>
      <div className="cart-header">
        <span>Edit Product</span>
      </div>

      <div className="add-product-form-container">
        {imageUrl && <img style={{ width: "100px" }} src={imageUrl} alt="" />}
        <form onSubmit={(e) => onSubmit(e)} className="add-product-form">
          <label className="add-product-input-label">Image</label>
          <input
            required={productImageUpdated}
            className="add-product-input add-product-img-input"
            accept=".png,.jpeg,.jpg"
            type="file"
            placeholder="Name"
            name="image"
            onChange={(e) => handleImgSelection(e)}
          />
          <label className="add-product-input-label">Name</label>
          <input
            value={name}
            required
            className="add-product-input"
            type="text"
            placeholder="Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="add-product-input-label">Category</label>
          <input
            value={category}
            required
            className="add-product-input"
            type="text"
            placeholder="Category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
          />
          <label className="add-product-input-label">Subtext</label>
          <input
            value={subtext}
            required
            className="add-product-input"
            type="text"
            placeholder="Subtext"
            name="subtext"
            onChange={(e) => setSubtext(e.target.value)}
          />
          <label className="add-product-input-label">Price</label>
          <input
            value={price}
            required
            className="add-product-input"
            type="number"
            placeholder="Price"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <label className="add-product-input-label">Stock</label>
          <input
            value={stock}
            required
            className="add-product-input"
            type="number"
            placeholder="Stock"
            name="stock"
            onChange={(e) => setStock(e.target.value)}
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
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
