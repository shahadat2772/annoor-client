import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Loading/Loading";

const RequireAdmin = () => {
  const location = useLocation();
  const { logOut, userInfo, user, userLoading, userInfoLoading, tokenLoading } =
    useContext(AuthContext);

  // Sorry if you don't like this condition :)
  if (
    userLoading ||
    userInfoLoading ||
    tokenLoading ||
    (user && !userInfo && !userLoading && !userInfoLoading && !tokenLoading)
  ) {
    return <Loading />;
  }

  if (userInfo?.role !== "admin") {
    logOut();
    return <Navigate to={"/signIn"} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
