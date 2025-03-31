import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Typography
} from "@mui/material";
import { AxiosInstance } from "../utils/axiosInstance";

function Subordinates({ open, onClose, jobCode, officialDesignation }) {
  const testsubordinates = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];
  const axios = AxiosInstance();

  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const objectToFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  };

  useEffect(() => {
    if (!open || !jobCode) return; // Prevent unnecessary calls

    const fetchSubordinate = async () => {
      setLoading(true);
      setError(null);
      setSubordinates([]); // Reset subordinates before fetching
      try {

        const formData = objectToFormData({ job_code: jobCode });
        const options = {
          method: "POST",
          url: "/JobRolesAndDescription/getSubordinates.json",
          data: formData,
        };

        const response = await axios(options);

        if (response.data.is_success && response.data.data.length > 0) {
            setSubordinates(response.data.data);
          } else {
            setSubordinates([]);
          }
      } catch (err) {
        console.error("Error fetching subordinates:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubordinate();
  }, [open, jobCode]);

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
    <DialogTitle
      sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "white",
        p: 2,
      }}
    >
      Subordinates of {officialDesignation}
    </DialogTitle>
    {loading && <LinearProgress />}
    <DialogContent>
      {loading ? (
        <Typography>Loading subordinates...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : subordinates.length > 0 ? (
        <List>
          {subordinates.map((subordinate, index) => (
            <React.Fragment key={subordinate.id}>
              <ListItem>
                <ListItemText
                 primary={subordinate.job_role || "No report to assigned"}
                 secondary={
                   <Typography
                     component="span"
                     variant="body2"
                     color="text.secondary"
                   >
                     ({subordinate.job_code})
                   </Typography>
                 }
              />
              </ListItem>
              {index < subordinates.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography sx={{ paddingTop: 2 }}>No subordinates found.</Typography>

      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" sx={{
            mt: 1,
            "&:focus": { outline: "none" }, // Removes outline on focus
            "&:hover": { outline: "none" }, // Ensures no outline on hover
          }}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default Subordinates;
