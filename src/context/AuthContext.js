import { signOut } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import fetcher from "../api";
import { auth } from "../firebase.init";

export const AuthContext = createContext();

const AnnnoorAuthContextProvider = ({ children }) => {
  const [user, userLoading] = useAuthState(auth);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);

  const getToken = async () => {
    setTokenLoading(true);
    const name = user?.displayName;
    const email = user?.email;
    const uid = user?.uid;
    const phoneNumber = user?.phoneNumber;

    let userInfo = { uid };
    if (phoneNumber) {
      userInfo = { ...userInfo, phoneNumber };
    }
    if (email) {
      userInfo = { ...userInfo, email, name };
    }

    fetch("https://annoor-server-production-af32.up.railway.app/token", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userInfo),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          const token = result.data;
          window.localStorage.setItem("accessToken", token);
          setToken(token);
          setTokenLoading(false);
        } else {
          toast.error("Something went wrong.");
          logOut();
          setTokenLoading(false);
        }
      });
  };

  const fetchUserInfo = () => {
    setUserInfoLoading(true);
    fetch("https://annoor-server-production-af32.up.railway.app/user", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        uid: user.uid,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setUserInfo(result.data);
          setUserInfoLoading(false);
        } else {
          toast.error(result?.message);
          logOut();
          setUserInfoLoading(false);
        }
      });
  };

  useEffect(() => {
    if (user) {
      getToken();
    }
  }, [user]);

  useEffect(() => {
    if (user && token) {
      fetchUserInfo();
    }
  }, [user, token]);

  const logOut = () => {
    signOut(auth);
    setUserInfo(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading,
        token,
        tokenLoading,
        userInfo,
        fetchUserInfo,
        logOut,
        userInfoLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AnnnoorAuthContextProvider;
