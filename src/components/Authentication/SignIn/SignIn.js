import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./SignIn.css";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../firebase.init";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../../assets/logo/google.png";
import facebook from "../../../assets/logo/facebook.png";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useTimer } from "use-timer";

import { AuthContext } from "../../../context/AuthContext";

const SignIn = () => {
  const { token } = useContext(AuthContext);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const number = "+" + phoneNumber;
  const [verificationCode, setVerificationCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const { time, start, reset } = useTimer({
    initialTime: 60,
    endTime: 0,
    onTimeOver: () => {
      document.getElementById("verification-code-input").value = "";
      setVerifyOpen(false);
      reset();
    },
    timerType: "DECREMENTAL",
  });

  const navigate = useNavigate();

  const facebookProvider = new FacebookAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
        "expired-callback": () => {
          generateRecaptcha();
        },
      },
      auth
    );
  };

  useEffect(() => {
    generateRecaptcha();
  }, []);

  const handleSignInWithPhoneNumber = () => {
    if (number.length !== 14) {
      toast.error("Please enter an valid phone number.", {
        id: "invalid-phone-number",
      });
      return;
    }
    let appVerifier = window.recaptchaVerifier;
    setSendingOtp(true);
    signInWithPhoneNumber(auth, number, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setSendingOtp(false);
        setVerifyOpen(true);
        start();
      })
      .catch((error) => {
        setSendingOtp(false);
        toast.error(
          "Something went wrong when sending OTP, please recheck phone number.",
          { id: "verification-sms-error" }
        );
      });
  };

  const verifyOTP = () => {
    if (verificationCode === "" || verificationCode.length !== 6) {
      toast.error("Invalid OTP", {
        id: "invalid-otp-toast",
      });
      return;
    }
    window.confirmationResult
      .confirm(verificationCode)
      .then((result) => {})
      .catch((error) => {
        toast.error(error.message, {
          id: "code-confirmation-error",
        });
      });
  };

  const handleSignInWithFaceBook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {})
      .catch((error) => {
        toast.error(error.message, {
          id: "social-sign-in",
        });
      });
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {})
      .catch((error) => {
        toast.error(error.message, {
          id: "social-sign-in",
        });
      });
  };

  if (token) {
    toast.success("Thank you so much!");
    navigate("/food");
  }

  return (
    <div className="sign-in-container">
      <div className="sign-in">
        <Typography sx={{ fontSize: "18px" }} variant="h6">
          Login
        </Typography>
        <div className="social-login">
          <button
            onClick={() => handleSignInWithFaceBook()}
            className="facebook-login-button"
          >
            <img src={facebook} alt="" />
            <span>CONTINUE WITH FACEBOOK</span>
          </button>
          <button
            onClick={() => handleSignInWithGoogle()}
            className="google-login-button"
          >
            <img src={googleLogo} alt="" />
            <span>CONTINUE WITH GOOGLE</span>
          </button>
        </div>
        <Divider>or</Divider>
        <div className="mobile-phone-login">
          <div id="recaptcha-container"></div>
          {!verifyOpen && (
            <div className="sign-in-with-phone-container">
              <p className="phone-sing-up-header">ENTER YOUR PHONE NUMBER</p>
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
              <button
                disabled={sendingOtp}
                onClick={() => handleSignInWithPhoneNumber()}
                className="action-button"
              >
                {!sendingOtp ? "SEND OTP" : "SENDING OTP.."}
              </button>
            </div>
          )}
          {verifyOpen && (
            <div className="verify-phone-number-container">
              <p className="verifyNumberHeader">
                We've sent a 6-digit one time PIN in your phone {number}
              </p>
              <input
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6 digit OTP here"
                id="verification-code-input"
                type="number"
              />
              <button onClick={() => verifyOTP()} className="action-button">
                VERIFY NUMBER ({time})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
