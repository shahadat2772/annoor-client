import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { AuthContext } from "../../context/AuthContext";
const Profile = () => {
  const { userInfo, fetchUserInfo, user } = useContext(AuthContext);
  const [userName, setUserName] = useState();
  const [userGender, setUserGender] = useState();
  const [userDateOfBirth, setUserDateOfBirth] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
      setUserGender(userInfo?.gender);
      setUserDateOfBirth(userInfo?.dateOfBirth);
      setPhoneNumber(userInfo?.phoneNumber);
      setAddress(userInfo?.address);
    }
  }, [userInfo]);

  const updateProfile = () => {
    if (address === "" || address === undefined) {
      return toast.error("Please enter you address.", {
        id: "profile-update-toast",
      });
    }

    if (userName === "" || userName === "") {
      return toast.error("Please enter you name.", {
        id: "profile-update-toast",
      });
    }

    if (
      userInfo?.name === userName &&
      userInfo?.gender === userGender &&
      userInfo?.dateOfBirth === userDateOfBirth &&
      userInfo?.phoneNumber === phoneNumber &&
      userInfo?.address === address
    ) {
      return toast("Please make changes to update profile.", {
        id: "profile-update-toast",
      });
    }

    let number;
    if (phoneNumber[0] !== "+") {
      number = "+" + phoneNumber;
    } else {
      number = phoneNumber;
    }

    if (number.length !== 14) {
      console.log(number);
      toast.error("Please enter an valid phone number.", {
        id: "profile-update-toast",
      });
      return;
    }

    const updatedUserInfo = {
      name: userName,
      gender: userGender,
      dateOfBirth: userDateOfBirth,
      phoneNumber: number,
      address: address,
    };

    fetch(
      "https://annoor-server-production-af32.up.railway.app/update-user-info",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          uid: user.uid,
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedUserInfo),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message, {
            id: "profile-update-toast",
          });
          fetchUserInfo();
        } else {
          toast.error(data.message, {
            id: "profile-update-toast",
          });
          fetchUserInfo();
        }
      });
  };

  return (
    <div>
      <div className="cart-header">
        <span>Your Profile</span>
      </div>
      <div className="profile-info-container">
        <label htmlFor="user-name">Name</label>
        <input
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          name="user-name"
          id=""
          required
        />
        {userInfo?.email && (
          <>
            <label htmlFor="user-email">Email</label>
            <input
              value={userInfo?.email}
              type="email"
              name="user-email"
              disabled
            />
          </>
        )}
        <label className="user-phone-label" htmlFor="user-phone">
          Phone
        </label>
        <PhoneInput
          value={phoneNumber}
          placeholder={"Phone number"}
          disableDropdown
          autoFormat={false}
          onlyCountries={["bd"]}
          country={"bd"}
          countryCodeEditable={false}
          disableCountryGuess
          onChange={(value) => setPhoneNumber(value)}
        />
        <label htmlFor="user-date-of-birth">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="user-address"
          placeholder="e.g House 26, Road 16/C, Merul Badda, Badda"
        />
        <label htmlFor="user-gender">Gender</label>
        <select
          onChange={(e) => setUserGender(e.target.value)}
          value={userGender}
          type="text"
          name="user-gender"
        >
          <option value="">-- Select Gender --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        <label htmlFor="user-date-of-birth">Date of birth (DD-MM-YYYY)</label>
        <input
          onChange={(e) => setUserDateOfBirth(e.target.value)}
          value={userDateOfBirth}
          type="text"
          name="user-date-of-birth"
          maxLength={10}
          placeholder="Enter you birth date"
        />
        <Button
          onClick={() => updateProfile()}
          sx={{ marginTop: "8px", display: "block", marginLeft: "auto" }}
          variant="contained"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Profile;
