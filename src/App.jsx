import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import RequireAuth from "./components/RequireAuth";
import theme from "./theme";
import SignIn from "./components/SignIn";
import Layout from "./components/Layout";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<RedirectIfAuthenticated />}>
            <Route index element={<SignIn />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<RequireAuth redirectPath="/signin" />}>
            <Route path="/*" element={<Layout />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
