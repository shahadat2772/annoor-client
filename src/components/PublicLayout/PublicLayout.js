import { Box, Drawer } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Categories from "./Categories/Categories";
import "./PublicLayout.css";

const PublicLayout = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

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
          <Categories handleMobileDrawerToggle={handleMobileDrawerToggle} />
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
          <Categories />
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

export default PublicLayout;
