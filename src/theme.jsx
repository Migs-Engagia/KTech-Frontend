import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#EF4444",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FACC15",
      contrastText: "#212121",
    },
    background: {
      default: "#FFFDF8",
      paper: "#FFFFFF",
    },
    info: {
      main: "#0077B6",
    },
    success: {
      main: "#43A047",
    },
    warning: {
      main: "#F9A825",
    },
    error: {
      main: "#D32F2F",
    },
    text: {
      primary: "#1C2B36",
      secondary: "#555",
    },
    neutral: {
      main: "#FCD5B5",
      contrastText: "#212121",
    },
    accent: {
      main: "#EAB38D",
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
  components: {
    MuiButton: {
      styleOverrides: {
        outlinedError: {
          "&:hover": {
            backgroundColor: "#FFE6E6", // Soft red background
            borderColor: "#D32F2F",
            color: "#D32F2F",
          },
        },
        containedError: {
          "&:hover": {
            backgroundColor: "#B71C1C", // Darker red
          },
        },
      },
    },
  },
});

export default theme;
