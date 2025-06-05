import React, { useState } from "react";
import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import theme from "../theme";
import Dashboard from "../components/Dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

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

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" noWrap>
            KTECH PORTAL
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Typography sx={{ mr: 1 }}>
              {user.district} District, {user.first_name} {user.last_name}
            </Typography>
            |
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <ExitToAppIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 6, mt: 8 }}>
        <Dashboard user={user} />
      </Box>
    </Box>
  );
}

export default Layout;
