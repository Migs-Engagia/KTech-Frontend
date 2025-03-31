import React, { useState } from "react";
import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Routes, Route, useNavigate } from "react-router-dom";
import theme from "../theme";
import MainDrawer from "../components/MainDrawer";
import JobRolesAndDescription from "../components/JobRolesAndDescription";
import JobRoleDetailsPage from "./JobRoleDetailsPage";
import ReportingRelationships from "./ReportingRelationships";
import Routines from "./Routines";
import logo from "../logo.png";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import Dashboard from "../pages/Dashboard";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* {isSmallScreen && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )} */}
          <Typography variant="h5" noWrap>
            KTECH PORTAL
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            color="inherit"
            onClick={handleLogout}
            edge="end"
            title="Logout"
          >
            <ExitToAppIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER IS NOT YET NEEDED */}
      {/* <MainDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      /> */}
    </Box>
  );
}

export default Layout;
