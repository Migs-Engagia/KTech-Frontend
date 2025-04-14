import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const SuccessErrorModal = ({ open, onClose, type, message }) => {
  const isSuccess = type === "success";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: isSuccess ? "success.main" : "error.main",
          fontWeight: 600,
        }}
      >
        {isSuccess ? (
          <CheckCircleIcon fontSize="medium" />
        ) : (
          <ErrorIcon fontSize="medium" />
        )}
        {isSuccess ? "Success" : "Error"}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {message ||
            (isSuccess
              ? "Operation completed successfully!"
              : "Something went wrong. Please try again.")}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          color={isSuccess ? "success" : "error"}
          sx={{ textTransform: "none", borderRadius: 1 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessErrorModal;
