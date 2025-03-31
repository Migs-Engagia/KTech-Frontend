import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Drawer,
  Collapse,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import useAuth from "../hooks/UseAuth"; // Import useAuth

const drawerWidth = 240;

// Function to generate a consistent color based on a string (e.g., user ID or username)
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  {
    text: "Job Roles and Description",
    icon: <AssignmentIcon />,
    path: "/job-roles-description",
  },
  {
    text: "Reporting Relationships",
    icon: <PeopleIcon />,
    path: "/reporting-relationships",
  },
  {
    text: "Routines and Workloads",
    icon: <WorkIcon />,
    path: "/routines-and-workloads",
  },
  {
    text: "Job Assignments",
    icon: <AssignmentIndIcon />,
    // path: "/job-assignments",
    subItems: [
      {
        text: "Employees",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        path: "/job-assignments/employees",
      },
    ],
  },
  {
    text: "Organizational Chart",
    icon: <AccountTreeIcon />,
    // path: "/org-chart",
    subItems: [
      {
        text: "View Org Chart",
        icon: <FiberManualRecordOutlinedIcon fontSize="small" />,
        path: "/org-chart/view",
      },
    ],
  },
];

const MainDrawer = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const { auth, logout } = useAuth(); // Use the auth context

  const handleToggle = (item) => {
    setOpenMenus((prev) => ({ ...prev, [item.text]: !prev[item.text] }));
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // Get user info from auth context
  const user = auth?.user || {};
  const fullName = `${user.first_name || "User"} ${
    user.last_name || ""
  }`.trim();
  const initials = `${user.first_name?.[0] || "U"}${
    user.last_name?.[0] || ""
  }`.toUpperCase();

  // Generate a consistent color based on user ID or username
  const userIdentifier = user.id?.toString() || user.username || "default"; // Fallback to "default" if no ID or username
  const avatarColor = stringToColor(userIdentifier);

  const drawerContent = (
    <Box sx={{ overflow: "auto", mt: 8 }}>
      <List>
        {/* User Info Section */}
        <ListItem sx={{ marginBottom: 3 }}>
          <Avatar
            sx={{
              bgcolor: avatarColor, // Use user-specific color
              marginRight: 2,
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="subtitle1">{fullName}</Typography>
        </ListItem>

        {/* Navigation Items */}
        {menuItems.map((item) => {
          const isSubmenuActive =
            item.subItems &&
            item.subItems.some((subItem) => location.pathname === subItem.path);
          const isOpen = openMenus[item.text] || isSubmenuActive;

          return (
            <React.Fragment key={item.text}>
              <ListItem
                button
                onClick={() => handleToggle(item)}
                selected={location.pathname === item.path}
                sx={{
                  cursor: "pointer",
                  color: "rgba(0, 0, 0, 0.7)",
                  fontWeight:
                    location.pathname === item.path || isSubmenuActive
                      ? "bold"
                      : "normal",
                  "&.Mui-selected": {
                    fontWeight: "bold",
                    bgcolor: "rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {/* Render Sub-menu if available */}
              {item.subItems && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        component={Link}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{
                          pl: 4,
                          cursor: "pointer",
                          color: "black", // Keeps submenu text black
                          fontWeight:
                            location.pathname === subItem.path
                              ? "bold"
                              : "normal",
                          "&.Mui-selected": { bgcolor: "rgba(0, 0, 0, 0.1)" },
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.1)",
                            color: "black",
                          }, // Prevents blue hover
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}

        {/* Logout Button */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default MainDrawer;
