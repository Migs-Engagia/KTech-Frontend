import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

const MAX_LENGTH = 255;

const RecruitmentModal = ({ open, onClose, onSave, row }) => {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [recruitDate, setRecruitDate] = useState("");
  const [freeItems, setFreeItems] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [touchedSave, setTouchedSave] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus("");
      setRemarks("");
      setRecruitDate("");
      setFreeItems("");
      setShowConfirm(false);
      setTouchedSave(false);
    }
  }, [open]);

  const isWorkInProgress = status === "Work in Progress";
  const isRecruited = status === "Recruited";

  const remarksError = isWorkInProgress && touchedSave && !remarks.trim();
  const recruitDateError = isRecruited && touchedSave && !recruitDate;
  const freeItemsError = isRecruited && touchedSave && !freeItems.trim();

  const handleSaveClick = () => {
    setTouchedSave(true);

    if (!status) return;

    if (
      (isWorkInProgress && !remarks.trim()) ||
      (isRecruited && (!recruitDate || !freeItems.trim()))
    ) {
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onSave({ status, remarks, recruitDate, freeItems });
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Recruitment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Select Status</InputLabel>
            <Select
              value={status}
              label="Select Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending" disabled>
                Select Status
              </MenuItem>
              <MenuItem value="Not Recruited">Not Recruited</MenuItem>
              <MenuItem value="Work in Progress">Work in Progress</MenuItem>
              <MenuItem value="Recruited">Recruited</MenuItem>
            </Select>
          </FormControl>

          {isWorkInProgress && (
            <>
              <TextField
                label="Remarks"
                multiline
                rows={5}
                maxRows={4}
                fullWidth
                required
                error={remarksError}
                inputProps={{ maxLength: MAX_LENGTH }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={{ mb: 0.5 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  minHeight: 24,
                }}
              >
                <Typography
                  variant="caption"
                  color={remarksError ? "error" : "text.secondary"}
                >
                  {remarksError ? "Remarks are required." : " "}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {remarks.length}/{MAX_LENGTH} characters
                </Typography>
              </Box>
            </>
          )}

          {isRecruited && (
            <>
              <TextField
                type="date"
                label="Recruitment Date"
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                error={recruitDateError}
                helperText={
                  recruitDateError ? "Recruitment date is required." : undefined
                }
                value={recruitDate}
                onChange={(e) => setRecruitDate(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Free Items"
                multiline
                rows={5}
                maxRows={4}
                fullWidth
                required
                error={freeItemsError}
                inputProps={{ maxLength: MAX_LENGTH }}
                value={freeItems}
                onChange={(e) => setFreeItems(e.target.value)}
                sx={{ mb: 0.5 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  minHeight: 24,
                }}
              >
                <Typography
                  variant="caption"
                  color={freeItemsError ? "error" : "text.secondary"}
                >
                  {freeItemsError ? "Free items detail is required." : " "}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {freeItems.length}/{MAX_LENGTH} characters
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            disabled={!status}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save this recruitment update? This action cannot be undone."
      />
    </>
  );
};

export default RecruitmentModal;
