import { useTheme } from "@emotion/react";
import { Drawer, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down("md"));

  const adminMenuItems = (
    <div className="admin-menu-items-container">
      <li
        onClick={() => (smallDevice ? handleMobileDrawerToggle() : "")}
        className="admin-menu-item"
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-category" : "")}
          to={"/admin/orders"}
        >
          <span className="category-title">Orders</span>
        </NavLink>
      </li>
      <li
        onClick={() => (smallDevice ? handleMobileDrawerToggle() : "")}
        className="admin-menu-item"
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-category" : "")}
          to={"/admin/manage-product"}
        >
          <span className="category-title">Manage Products</span>
        </NavLink>
      </li>
      <li
        onClick={() => (smallDevice ? handleMobileDrawerToggle() : "")}
        className="admin-menu-item"
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-category" : "")}
          to={"/admin/add-product"}
        >
          <span className="category-title">Add Product</span>
        </NavLink>
      </li>
      <li
        onClick={() => (smallDevice ? handleMobileDrawerToggle() : "")}
        className="admin-menu-item"
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-category" : "")}
          to={"/admin/users"}
        >
          <span className="category-title">Users</span>
        </NavLink>
      </li>
      <li
        onClick={() => (smallDevice ? handleMobileDrawerToggle() : "")}
        className="admin-menu-item"
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-category" : "")}
          to={"/admin/offer"}
        >
          <span className="category-title">Offer</span>
        </NavLink>
      </li>
    </div>
  );

  return (
    <div>
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        handleMobileDrawerToggle={handleMobileDrawerToggle}
      />
      <Box sx={{ display: "flex" }}>
        {/* Drawer for mobile*/}
        <Drawer
          style={{ zIndex: 1250 }}
          variant={"temporary"}
          open={mobileDrawerOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "275px",
            },
          }}
        >
          {/* <Categories handleMobileDrawerToggle={handleMobileDrawerToggle} /> */}
          {adminMenuItems}
        </Drawer>
        {/* Drawer for large device */}
        <Drawer
          variant="persistent"
          sx={{
            display: { md: "block", xs: "none" },
            "& .MuiDrawer-paper": {
              width: "218px",
            },
          }}
          open={drawerOpen}
        >
          {/* <Categories /> */}
          {adminMenuItems}
        </Drawer>
        {/* Page content here */}
        <div
          className={`page-content-container ${
            drawerOpen ? "left-margin" : ""
          }`}
        >
          <Outlet></Outlet>
        </div>
      </Box>
    </div>
  );
};

export default AdminLayout;
