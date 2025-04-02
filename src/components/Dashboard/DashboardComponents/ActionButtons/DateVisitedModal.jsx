import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

const DateVisitedModal = ({ open, onClose, onSave, row }) => {
  const [date, setDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isQualityRaiser, setIsQualityRaiser] = useState(false);
  const [touchedSave, setTouchedSave] = useState(false);

  const showError = touchedSave && !date;
  const formattedDateOfInput = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open && row) {
      setIsQualityRaiser(!!row.qualityRaiser);
    }
  }, [open, row]);

  const handleSaveClick = () => {
    setTouchedSave(true);
    if (!date) return;
    setShowConfirm(true); // Trigger confirmation modal
  };

  const handleConfirmSave = () => {
    onSave(date);
    setShowConfirm(false);
    handleReset();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    setDate("");
    setTouchedSave(false);
    setIsQualityRaiser(false);
    setShowConfirm(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Date of Visit</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {isQualityRaiser ? (
            <FormControl fullWidth error={showError} sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  lineHeight: 1.6,
                }}
              >
                Please select the <strong>Date of Visit</strong>. <br />
                <em>This cannot be edited once saved.</em>
              </Typography>

              <TextField
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{
                  mb: 0.5,
                  backgroundColor: "#fafafa",
                  borderRadius: 1,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 0.5,
                  minHeight: 24,
                }}
              >
                <Typography
                  variant="caption"
                  color={showError ? "error" : "text.secondary"}
                >
                  {showError ? "Please select a valid date." : " "}
                </Typography>
                <Typography variant="caption" sx={{ textAlign: "right" }}>
                  Date of Input: {formattedDateOfInput}
                </Typography>
              </Box>
            </FormControl>
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>
              This action is only allowed for Quality Raisers.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            disabled={!isQualityRaiser}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save this Date of Visit? This action cannot be undone."
      />
    </>
  );
};

export default DateVisitedModal;
