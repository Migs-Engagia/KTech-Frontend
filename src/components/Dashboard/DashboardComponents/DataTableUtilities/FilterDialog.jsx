import axios from "../../../../utils/axiosInstance";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Button,
  Typography,
  Divider,
  Box,
  InputAdornment,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CircularProgress from "@mui/material/CircularProgress";

import LKDateRangePicker from "./DateRangePickers/LKDateRangePicker";
import VisitDateRangePicker from "./DateRangePickers/VisitDateRangePicker";
import dayjs from "dayjs";
const FilterDialog = ({
  open,
  onClose,
  onApply,
  filters,
  setFilters,
  filterOptions,
  setFilterOptions,
}) => {
  const [pendingFilters, setPendingFilters] = useState({
    province: "All",
    city: "All",
    qualityRaiser: "All",
    visited: "All",
    lkDateCreatedFrom: "",
    lkDateCreatedTo: "",
    visitDateFrom: "",
    visitDateTo: "",
  });

  const [loadingFilters, setLoadingFilters] = useState(false);

  const handleApply = () => {
    setFilters(pendingFilters);
    onApply();
  };

  const clearFilters = () => {
    setPendingFilters({
      province: "All",
      city: "All",
      qualityRaiser: "All",
      visited: "All",
      lkDateCreatedFrom: "",
      lkDateCreatedTo: "",
      visitDateFrom: "",
      visitDateTo: "",
    });
  };

  useEffect(() => {
    if (open && filterOptions?.cities?.length === 0) {
      fetchFilterOptions();
    }
  }, [open]);

  const fetchFilterOptions = async () => {
    // setLoading(true);
    setLoadingFilters(true);
    try {
      const response = await axios.get("/dashboard/fetchFilterOptions.json");
      const { data } = response.data;
      setFilterOptions(data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleDisabled = () => {
    const lkDateCreatedFrom = pendingFilters.lkDateCreatedFrom;
    const lkDateCreatedTo = pendingFilters.lkDateCreatedTo;
    const visitDateFrom = pendingFilters.visitDateFrom;
    const visitDateTo = pendingFilters.visitDateTo;

    const status =
      (lkDateCreatedFrom != "" && lkDateCreatedTo === "") ||
      (visitDateFrom != "" && visitDateTo === "");
    return status;
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">Filter Raiser Table</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ mb: 2 }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              {loadingFilters && (
                <>
                  <CircularProgress size={16} />
                </>
              )}
              Province, City or Municipality
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Province"
                select
                fullWidth
                disabled={loadingFilters}
                value={pendingFilters.province}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    province: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {filterOptions.provinces.map((prov) => (
                  <MenuItem key={prov} value={prov}>
                    {prov}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="City/Municipality"
                select
                fullWidth
                value={pendingFilters.city}
                disabled={loadingFilters}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {filterOptions.cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Raiser Status
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Quality Raiser"
                select
                fullWidth
                value={pendingFilters.qualityRaiser}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    qualityRaiser: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HowToRegIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Y">Yes</MenuItem>
                <MenuItem value="N">No</MenuItem>
              </TextField>

              <TextField
                label="Visited"
                select
                fullWidth
                value={pendingFilters.visited}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    visited: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventAvailableIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Y">Yes</MenuItem>
                <MenuItem value="N">No</MenuItem>
              </TextField>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              LK Date Created
            </Typography>
            <LKDateRangePicker
              pendingFilters={pendingFilters}
              setPendingFilters={setPendingFilters}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Date Visited
            </Typography>
            <VisitDateRangePicker
              pendingFilters={pendingFilters}
              setPendingFilters={setPendingFilters}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={clearFilters} variant="outlined" color="error">
          Clear Filters
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={handleDisabled()}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
