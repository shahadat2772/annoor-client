import { Button, Switch } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import "./Offer.css";

const Offer = () => {
  const [offerText, setOfferText] = useState("");
  const { userInfo } = useContext(AuthContext);

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

  const saveOffer = () => {
    fetch("https://annoor-server-production-af32.up.railway.app/save-offer", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        uid: userInfo.uid,
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ offerText }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message, {
            id: "offer-updated",
          });
        } else {
          toast.error(result.message, {
            id: "offer-updated",
          });
        }
      });
  };

  return (
    <div>
      <div style={{ paddingBottom: "10px" }} className="cart-header">
        <span>Offer</span>
      </div>

      <div className="offer-container">
        <input
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          type="text"
          placeholder="Offer text here"
        />
        <Button
          onClick={() => saveOffer()}
          sx={{ mt: "15px" }}
          variant="contained"
          size="small"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Offer;
