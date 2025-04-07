import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

import dayjs from "dayjs";
import { useState, useEffect } from "react";

const MAX_LENGTH = 255;

const RecruitmentModal = ({ open, onClose, onSave, row }) => {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [recruitDate, setRecruitDate] = useState(null);
  const [freeItems, setFreeItems] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [touchedSave, setTouchedSave] = useState(false);

  const isWorkInProgress = status === "Work in Progress";
  const isRecruited = status === "Recruited";

  const remarksError = isWorkInProgress && touchedSave && !remarks.trim();
  const recruitDateError = isRecruited && touchedSave && !recruitDate;
  const freeItemsError = isRecruited && touchedSave && !freeItems.trim();

  useEffect(() => {
    if (open) {
      setStatus("");
      setRemarks("");
      setRecruitDate(null);
      setFreeItems("");
      setShowConfirm(false);
      setTouchedSave(false);
    }
  }, [open]);

  const handleSaveClick = () => {
    setTouchedSave(true);

    if (!status) return;

    const isInvalid =
      (isWorkInProgress && !remarks.trim()) ||
      (isRecruited && (!recruitDate || !freeItems.trim()));

    if (isInvalid) return;

    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const recruitment = {
      ...row,
      recruitmentStatus: status,
      recruitmentDate: recruitDate
        ? dayjs(recruitDate).format("YYYY-MM-DD")
        : "",
      remarks: remarks,
      freeItems: freeItems,
    };
    onSave(recruitment);
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>
          Recruitment Status
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
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
            <FormControl fullWidth error={remarksError}>
              <TextField
                label="Remarks"
                multiline
                rows={5}
                fullWidth
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                inputProps={{ maxLength: MAX_LENGTH }}
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
            </FormControl>
          )}

          {isRecruited && (
            <>
              <FormControl fullWidth error={recruitDateError} sx={{ mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Recruitment Date"
                    value={recruitDate}
                    onChange={(newValue) => setRecruitDate(newValue)}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: recruitDateError,
                        helperText: recruitDateError
                          ? "Recruitment date is required."
                          : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl fullWidth error={freeItemsError}>
                <TextField
                  label="Free Items"
                  multiline
                  rows={5}
                  fullWidth
                  required
                  value={freeItems}
                  onChange={(e) => setFreeItems(e.target.value)}
                  inputProps={{ maxLength: MAX_LENGTH }}
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
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            disabled={!status}
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
