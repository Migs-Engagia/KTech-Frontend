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
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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

  const isWorkInProgress = status === 1;
  const isRecruited = status === 2;
  const isAlreadyRecruited = !!row?.recruitmentDate;

  const isRecruitDateBeforeLK =
    row?.lkDateCreated && dayjs(recruitDate).isBefore(dayjs(row.lkDateCreated));

  const recruitDateError =
    isRecruited && touchedSave && !isAlreadyRecruited && !recruitDate;
  const remarksError = isWorkInProgress && touchedSave && !remarks.trim();
  const freeItemsError =
    isRecruited && touchedSave && !isAlreadyRecruited && !freeItems.trim();

  useEffect(() => {
    if (open) {
      setStatus(row?.recruitmentStatus ?? 0);
      setRemarks(row?.remarks || "");
      setRecruitDate(row?.recruitmentDate ? dayjs(row.recruitmentDate) : null);
      setFreeItems(row?.freeItems ?? "");
      setShowConfirm(false);
      setTouchedSave(false);
    }
  }, [open]);

  const handleSaveClick = () => {
    setTouchedSave(true);

    if (!status) return;

    const isInvalid =
      (isWorkInProgress && !remarks.trim()) ||
      (isRecruited &&
        !isAlreadyRecruited &&
        (!recruitDate || !freeItems.trim()));

    if (isInvalid) return;

    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const recruitment = {
      ...row,
      recruitmentStatus: status,
      dateRecruited: recruitDate ? dayjs(recruitDate).format("YYYY-MM-DD") : "",
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
        <DialogContent>
          {!isAlreadyRecruited && (
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Select Status</InputLabel>
              <Select
                value={status}
                label="Select Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={0} disabled>
                  Select Status
                </MenuItem>
                <MenuItem value={3}>Not Recruited</MenuItem>
                <MenuItem value={1}>Work in Progress</MenuItem>
                <MenuItem value={2}>Recruited</MenuItem>
              </Select>
            </FormControl>
          )}
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
              {isAlreadyRecruited ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, mt: 2 }}
                  >
                    This raiser has already been recruited. The saved
                    information is shown below:
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Recruitment Date
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {recruitDate
                          ? dayjs(recruitDate).format("MMMM D, YYYY")
                          : "—"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Free Items
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, whiteSpace: "pre-line" }}
                      >
                        {freeItems || "—"}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <FormControl
                    fullWidth
                    error={recruitDateError}
                    sx={{ mb: 2, mt: 1 }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Recruitment Date"
                        value={recruitDate}
                        onChange={(newValue) => setRecruitDate(newValue)}
                        minDate={
                          row?.lkDateCreated
                            ? dayjs(row.lkDateCreated)
                            : undefined
                        }
                        slotProps={{
                          textField: {
                            required: true,
                            fullWidth: true,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color={recruitDateError ? "error" : "text.secondary"}
                      >
                        {recruitDateError
                          ? "Recruitment date is required."
                          : ""}
                      </Typography>
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
                        {freeItemsError
                          ? "Free items detail is required."
                          : " "}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {freeItems.length}/{MAX_LENGTH} characters
                      </Typography>
                    </Box>
                  </FormControl>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="error">
            Close
          </Button>
          {!isAlreadyRecruited && (
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
          )}
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
