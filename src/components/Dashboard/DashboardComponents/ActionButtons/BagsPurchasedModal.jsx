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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import axios from "../../../../utils/axiosInstance";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import ConfirmationModal from "../../../ConfirmationDialogs/ConfirmationModal";

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    let isMounted = true;

    if (open) {
      fetchBagsPurchased(isMounted);
    } else {
      setBagsPerMonth({});
      setErrors({});
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [open]);

  const fetchBagsPurchased = async (isMounted) => {
    setLoading(true);
    try {
      const response = await axios.post("/dashboard/fetchBagsPurchased.json", {
        id: row?.id,
      });

      if (response.data?.success && isMounted) {
        setBagsPerMonth(response.data.data.bags_per_month || {});
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      }
      console.error("Error fetching bags purchased data:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const handleChange = (month, value) => {
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

  const handleSaveClick = () => {
    if (!bagsPerMonth) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    onSave({
      bagsPerMonth,
    });
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Bags Purchased</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {quarters.map((quarter) => (
                <Box key={quarter.label}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {quarter.label}
                  </Typography>
                  <Stack spacing={2}>
                    {quarter.months.map((month) => {
                      const monthData = bagsPerMonth[month] || {};
                      const isError = errors[month];
                      const hasBeenModified = !!monthData.modified;

                      return (
                        <Box
                          key={month}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          sx={{ ml: 2 }}
                        >
                          <Typography sx={{ width: 80 }}>{month}</Typography>
                          <TextField
                            label="No. of bags"
                            type="text"
                            size="small"
                            value={monthData.bags || ""}
                            onChange={(e) =>
                              handleChange(month, e.target.value)
                            }
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                            error={isError}
                            helperText={isError ? "Must be 0 or higher" : ""}
                            sx={{
                              flex: 1,
                              mt: 0.5,
                            }}
                          />
                          <Tooltip title="Last Modified">
                            <Typography
                              variant="caption"
                              sx={{
                                whiteSpace: "nowrap",
                                width: 130,
                                textAlign: "right",
                              }}
                            >
                              {hasBeenModified
                                ? dayjs(monthData.modified).format(
                                    "MMMM D, YYYY • h:mm A"
                                  )
                                : "Not modified"}
                            </Typography>
                          </Tooltip>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            variant="contained"
            disabled={isEmpty || hasErrors || loading}
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
        message="Are you sure you want to save this bags purchased?"
      />
    </>
  );
};

export default BagsPurchasedModal;
