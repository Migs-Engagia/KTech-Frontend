import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const ProgressModal = ({ open, message }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={3}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
            {message || "Processing... Please wait..."}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;
