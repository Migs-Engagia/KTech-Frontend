import { useState } from "react";
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
  Collapse,
  InputAdornment,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const FilterDialog = ({
  open,
  onClose,
  onApply,
  filters,
  setFilters,
  options,
  loading,
}) => {
  const [pendingFilters, setPendingFilters] = useState({
    province: "All",
    city: "All",
    municipality: "All",
    qualityRaiser: "All",
    visited: "All",
  });

  const handleApply = () => {
    setFilters(pendingFilters);
    onApply();
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
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Province, City and Municipality
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Province"
                select
                fullWidth
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
                {options.provinces.map((prov) => (
                  <MenuItem key={prov} value={prov}>
                    {prov}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="City"
                select
                fullWidth
                value={pendingFilters.city}
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
                {options.cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Municipality"
                select
                fullWidth
                value={pendingFilters.municipality}
                onChange={(e) =>
                  setPendingFilters((prev) => ({
                    ...prev,
                    municipality: e.target.value,
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
                {options.municipalities.map((mun) => (
                  <MenuItem key={mun} value={mun}>
                    {mun}
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
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleApply}>
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
