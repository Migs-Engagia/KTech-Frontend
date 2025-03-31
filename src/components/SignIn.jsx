import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AccountCircle } from "@mui/icons-material";
import useAuth from "../hooks/UseAuth";
import { AxiosInstance } from "../utils/axiosInstance";
import ProgressModal from "./ProgressModal";

const SignIn = () => {
  const axios = AxiosInstance();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axios.post("/users/google-login.json", {
        id_token: credentialResponse.credential,
      });

      const { token, user } = response.data;
      console.log(response);
      if (token && user) {
        login(token, user);
        navigate("/");
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Error", error);
      const msg = error?.response?.data?.message || "Google Sign-In failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
      className="sign-in-bg"
    >
      <Paper
        elevation={10}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 4,
          p: 5,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            mx: "auto",
          }}
        >
          <AccountCircle sx={{ fontSize: 54 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome to{" "}
          <span style={{ color: theme.palette.primary.main }}>KTECH</span>
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontSize: 14 }}
        >
          Sign in with your Google account to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 3, fontSize: 13, color: "text.secondary" }}>
          Sign in with Google
        </Divider>

        <Box display="flex" justifyContent="center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setError("Google Sign-In failed")}
            theme="outline"
            size="large"
            shape="pill"
            logo_alignment="center"
          />
        </Box>
      </Paper>

      <ProgressModal open={loading} message="Signing you in. Please wait..." />
    </Box>
  );
};

export default SignIn;
