import React, { useState, useEffect } from "react";
import { Box, Button, Typography, LinearProgress, TextField, Autocomplete, Paper, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CreateJobRoleAndDescriptionDialog from "./CreateJobRoleAndDescriptionDialog";
import { AxiosInstance } from "../utils/axiosInstance";
import GroupIcon from "@mui/icons-material/Group";
import JobRolesTable from "./JobRolesTable";
import ProgressModal from "./ProgressModal";

function JobRolesAndDescription() {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const axios = AxiosInstance();
  const [jobRolesData, setJobRolesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobRoles, setFilteredJobRoles] = useState([]);
  const [searchText, setSearchText] = useState("");

  const test = async () => {
    try {
      const loginOptions = {
        method: "POST",
        url: "/users/test.json",
      };

      const response = await axios(loginOptions);
      console.log(response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get(
          "/JobRolesAndDescription/getJobRolesData.json"
        );
        if (response.data.is_success) {
          setJobRolesData(response.data.data);
          setFilteredJobRoles(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch job roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  const handleSearchChange = async (event, value) => {
    setSearchText(value);
    setSearchLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = jobRolesData.filter((job) =>
          job.official_designation.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredJobRoles(filtered);
      } else {
        setFilteredJobRoles(jobRolesData);
      }
      setSearchLoading(false);
    }, 500);
  };

  return (
    <Box sx={{ maxWidth: 1024, margin: "auto", padding: 1 }}>
      {/* Linear Progress Bar (Shows while loading) */}
      {loading && (
        <LinearProgress
          sx={{ position: "absolute", top: 64, left: 0, width: "100%" }}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "left",
          fontSize: { xs: "1.2rem", sm: "1.5rem" },
        }}
      >
        JOB ROLES AND DESCRIPTION
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "left", mb: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpen}
          sx={{
            "&:focus": { outline: "none" }, // Removes outline on focus
            "&:hover": {
              backgroundColor: "#8FD357", // Lighten the hover effect for secondary color
            },
          }}
        >
          ADD JOB ROLE
        </Button>
      </Box>

      <Paper elevation={1} sx={{ padding: 2, borderRadius: 0, display: "flex", justifyContent: "flex-end" }}>
      <Autocomplete
        freeSolo
        clearOnEscape
        options={jobRolesData
          .filter((job, index) =>
            searchText === ""
              ? index < 10
              : job.official_designation
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
          )
          .map((job) => job.official_designation)}
        value={searchText}
        onInputChange={handleSearchChange}
        disableClearable={false}
        renderInput={(params) => (
          <TextField {...params} label="Search Job Role" variant="outlined" size="small" sx={{
            '& .MuiInputLabel-root': { display: 'none' },  // Hide label
            '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' } // Hide fieldset text
          }} />
        )}
        sx={{ width: 300 }}
      />
    </Paper>
      <JobRolesTable jobRolesData={filteredJobRoles} />
      <CreateJobRoleAndDescriptionDialog open={open} onClose={handleClose} />
      <ProgressModal open={searchLoading} message="Searching..." />
    </Box>
  );
}

export default JobRolesAndDescription;
