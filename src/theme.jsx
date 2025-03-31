import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#EF4444", // Red from the card
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FACC15", // Yellow chip color
      contrastText: "#212121",
    },
    background: {
      default: "#FFFDF8", // Light warm base
      paper: "#FFFFFF",
    },
    info: {
      main: "#0077B6", // Blue (Sugar/Renewables)
    },
    success: {
      main: "#43A047", // Green for success
    },
    warning: {
      main: "#F9A825", // Yellow (Agri-Consumer) — alternate to chip yellow
    },
    error: {
      main: "#D32F2F", // Deeper red for errors
    },
    text: {
      primary: "#1C2B36",
      secondary: "#555",
    },
    neutral: {
      main: "#FCD5B5", // Light peach (hand)
      contrastText: "#212121",
    },
    accent: {
      main: "#EAB38D", // Beige (palm)
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
    h5: { fontWeight: 700 },
  },
});

export default theme;
