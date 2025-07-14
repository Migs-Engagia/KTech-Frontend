import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

const TagAsDuplicateModal = ({ open, onClose, onSave, row }) => {
  const [remarks, setRemarks] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [touchedSave, setTouchedSave] = useState(false);
  const showError = touchedSave && !remarks.trim();

  useEffect(() => {
    if (open && row) {
      setRemarks("");
      setTouchedSave(false);
    }
  }, [open, row]);

  const handleSaveClick = () => {
    setTouchedSave(true);
    if (!remarks.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const duplicateData = {
      ...row,
      remarks: remarks.trim(),
    };
    onSave(duplicateData);
    setShowConfirm(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>
          Tag as Duplicate
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}
            >
              Are you sure you want to tag this item as a duplicate?
            </Typography>

            <TextField
              label="Remarks *"
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              error={showError}
              helperText={
                showError
                  ? "Please provide a reason for tagging this as duplicate."
                  : "Please provide a reason for tagging this entry as duplicate."
              }
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            color="warning"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Tag as Duplicate"
        message="Are you sure you want to tag this item as a duplicate? This action cannot be undone."
      />
    </>
  );
};

export default TagAsDuplicateModal; 