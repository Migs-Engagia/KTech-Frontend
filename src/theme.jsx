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
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.3)", // Soft red glow
          },
        },
        outlinedError: {
          "&:hover": {
            backgroundColor: "#FFE6E6",
            borderColor: "#D32F2F",
            color: "#D32F2F",
          },
        },
        containedError: {
          "&:hover": {
            backgroundColor: "#B71C1C",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#EF4444",
          },
          "&.Mui-error": {
            color: "#EF4444",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(250, 204, 21, 0.3)", // warm yellow glow
          },
          "&:hover": {
            backgroundColor: "rgba(250, 204, 21, 0.15)", // translucent yellow hover
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#EF4444 !important",
            color: "#fff",
            boxShadow: "none",
            outline: "none",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#d73636 !important",
          },
          "&.MuiPickersDay-today": {
            border: "1px solid #EF4444 !important",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
