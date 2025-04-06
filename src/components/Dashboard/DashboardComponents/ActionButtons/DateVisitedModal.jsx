import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { useState, useEffect } from "react";
import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

const DateVisitedModal = ({ open, onClose, onSave, row }) => {
  const [date, setDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isQualityRaiser, setIsQualityRaiser] = useState(false);
  const [touchedSave, setTouchedSave] = useState(false);
  const [dateOfInput, setDateOfInput] = useState(null);
  const [isAlreadyVisited, setIsAlreadyVisited] = useState(false);
  const showError = touchedSave && !date;

  useEffect(() => {
    if (open && row) {
      setIsQualityRaiser(!!row.qualityRaiser);

      const alreadyVisited = !!row.customerVisited;
      setIsAlreadyVisited(alreadyVisited);

      setDate(alreadyVisited ? dayjs(row.dateOfVisit) : null);
      setDateOfInput(
        alreadyVisited
          ? row.dateOfVisitInput
          : dayjs().format("YYYY-MM-DD HH:mm:ss")
      );

      setTouchedSave(false);
    }
  }, [open, row]);

  const handleSaveClick = () => {
    setTouchedSave(true);
    if (!date) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const visit = {
      ...row,
      dateOfVisit: date.format("YYYY-MM-DD HH:mm:ss"),
      dateOfInput,
    };
    onSave(visit);
    setShowConfirm(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Date of Visit</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {isQualityRaiser ? (
            isAlreadyVisited ? (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1.5 }}
                >
                  This raiser has already been visited. The saved information is
                  shown below:
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Visit
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {dayjs(date).format("MMMM D, YYYY")}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Input
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {dayjs(dateOfInput).format("MMMM D, YYYY • h:mm A")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <FormControl fullWidth error={showError} sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "text.secondary", lineHeight: 1.6 }}
                >
                  Please select the <strong>Date of Visit</strong>. <br />
                  <em>This cannot be edited once saved.</em>
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                      setDateOfInput(dayjs().format("YYYY-MM-DD HH:mm:ss"));
                    }}
                    minDate={
                      row?.lkDateCreated ? dayjs(row.lkDateCreated) : undefined
                    }
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: showError,
                        variant: "outlined",
                        size: "medium",
                        sx: {
                          mb: 0.5,
                          backgroundColor: "#fafafa",
                          borderRadius: 1,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

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
                  <Typography variant="caption">
                    {dateOfInput
                      ? dayjs(dateOfInput).format("MMM D, YYYY • h:mm A")
                      : ""}
                  </Typography>
                </Box>
              </FormControl>
            )
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
          {!isAlreadyVisited && isQualityRaiser && (
            <Button
              onClick={handleSaveClick}
              variant="contained"
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
        message="Are you sure you want to save this Date of Visit? This action cannot be undone."
      />
    </>
  );
};

export default DateVisitedModal;
