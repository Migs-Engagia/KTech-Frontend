import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import { useState } from "react";

const quarters = [
  { label: "Q1: January - March", months: ["January", "February", "March"] },
  { label: "Q2: April - June", months: ["April", "May", "June"] },
  { label: "Q3: July - September", months: ["July", "August", "September"] },
  {
    label: "Q4: October - December",
    months: ["October", "November", "December"],
  },
];

const BagsPurchasedModal = ({ open, onClose, onSave, row }) => {
  const [bagsPerMonth, setBagsPerMonth] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (month, value) => {
    // Only allow digits (no letters, e, -, .)
    if (!/^\d*$/.test(value)) return;

    const numericValue = parseInt(value, 10);
    const now = new Date().toISOString();

    const isValid = value === "" || (!isNaN(numericValue) && numericValue >= 0);

    setErrors((prev) => ({
      ...prev,
      [month]: !isValid,
    }));

    setBagsPerMonth((prev) => ({
      ...prev,
      [month]: {
        bags: value,
        modified: isValid && value !== "" ? now : prev[month]?.modified,
      },
    }));
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isEmpty = Object.values(bagsPerMonth).every(
    (data) => !data.bags || data.bags === ""
  );

  const handleSave = () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    onSave({
      bagsPerMonth,
    });

    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bags Purchased of {row?.raiserName}</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {quarters.map((quarter) => (
            <Box key={quarter.label}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {quarter.label}
              </Typography>
              <Stack spacing={2}>
                {quarter.months.map((month) => {
                  const monthData = bagsPerMonth[month] || {};
                  const isError = errors[month];

                  return (
                    <Box
                      key={month}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{ ml: 2 }}
                    >
                      {/* Month Label */}
                      <Typography sx={{ width: 80 }}>{month}</Typography>

                      {/* Bags Input */}
                      <TextField
                        label="No of bags"
                        type="text"
                        size="small"
                        value={monthData.bags || ""}
                        onChange={(e) => handleChange(month, e.target.value)}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        error={isError}
                        helperText={isError ? "Must be 0 or higher" : ""}
                        sx={{ flex: 1, mt: 0.5 }}
                      />

                      {/* Modified Label */}
                      <Typography
                        variant="caption"
                        sx={{
                          whiteSpace: "nowrap",
                          width: 130,
                          textAlign: "right",
                        }}
                      >
                        {monthData.modified
                          ? new Date(monthData.modified).toLocaleString()
                          : "Not modified"}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Stack>

        {confirmed && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            Please confirm to finalize the save.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isEmpty || hasErrors}
        >
          {confirmed ? "Confirm Save" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BagsPurchasedModal;
