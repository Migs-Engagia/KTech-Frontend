import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const SuccessErrorModal = ({ open, onClose, type, message }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{type === "success" ? "Success" : "Error"}</DialogTitle>
      <DialogContent>
        <Typography color={type === "success" ? "green" : "red"}>
          {message || (type === "success" ? "Operation successful!" : "Something went wrong. Please try again.")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessErrorModal;
