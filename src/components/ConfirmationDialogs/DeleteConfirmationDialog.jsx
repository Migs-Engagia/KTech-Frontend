import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

function DeleteConfirmationDialog({ open, onClose, onConfirm, data }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{data}</strong>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="black"  sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus, &:active": { outline: "none", boxShadow: "none" },
            }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus  sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus, &:active": { outline: "none", boxShadow: "none" },
            }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
