import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";

const RoutineDialog = ({ open, onClose, onSave, roles, editingItem }) => {
  const [formData, setFormData] = React.useState({
    routineCode: "",
    routine: "",
    estimatedTime: "",
    assignedRole: [],
  });

  const [error, setError] = React.useState({
    estimatedTime: "",
  });

  useEffect(() => {
    if (editingItem) {
      const assignedRoleCodes = Array.isArray(editingItem.assigned_roles)
        ? editingItem.assigned_roles.map((role) => role.job_role_code)
        : [];

      setFormData({
        routineCode: editingItem.routine_code || "",
        routine: editingItem.job_routine || "",
        estimatedTime: editingItem.estimated_time || "",
        assignedRole: assignedRoleCodes,
      });
    } else {
      setFormData({
        routineCode: "",
        routine: "",
        estimatedTime: "",
        assignedRole: [],
      });
    }
  }, [editingItem, roles]);

  const handleTextChange = (name) => (event) => {
    const value = event.target.value;
    if (name === "estimatedTime") {
      const sanitizedValue = value.replace(/[^0-9.]/g, "");
      const dotCount = sanitizedValue.split(".").length - 1;
      if (dotCount <= 1) {
        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        setError((prev) => ({ ...prev, estimatedTime: "" }));
      } else {
        setError((prev) => ({
          ...prev,
          estimatedTime: "Only one dot is allowed",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutocompleteChange = (name) => (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.map((option) => option.code) : [],
    }));
  };

  const handleSave = () => {
    if (
      !/^\d*\.?\d*$/.test(formData.estimatedTime) ||
      formData.estimatedTime === ""
    ) {
      setError((prev) => ({
        ...prev,
        estimatedTime: "Please enter a valid number",
      }));
      return;
    }
    onSave(formData, editingItem); // Trigger confirmation, don’t reset form here
    setError({ estimatedTime: "" }); // Clear errors only
  };

  const roleOptions = roles.map((role) => ({
    code: role.code,
    label: role.official_designation,
  }));

  const handleKeyPress = (event) => {
    const { key } = event;
    const currentValue = formData.estimatedTime;
    const dotCount = currentValue.split(".").length - 1;

    if (
      (key === "." && dotCount >= 1) ||
      (key !== "." && isNaN(key) && key !== "Backspace" && key !== "Delete")
    ) {
      event.preventDefault();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          p: 2,
        }}
      >
        {editingItem ? "EDIT ROUTINE" : "CREATE ROUTINE"}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          autoFocus={!editingItem}
          margin="dense"
          name="routineCode"
          label="Routine Code"
          type="text"
          fullWidth
          value={formData.routineCode}
          onChange={handleTextChange("routineCode")}
          disabled={!!editingItem}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="routine"
          label="Routine"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.routine}
          onChange={handleTextChange("routine")}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="estimatedTime"
          label="Estimated Time"
          type="text"
          fullWidth
          value={formData.estimatedTime}
          onChange={handleTextChange("estimatedTime")}
          onKeyPress={handleKeyPress}
          error={!!error.estimatedTime}
          helperText={error.estimatedTime}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={roleOptions}
          getOptionLabel={(option) => option.label}
          value={
            roleOptions.filter((option) =>
              formData.assignedRole.includes(option.code)
            ) || []
          }
          onChange={handleAutocompleteChange("assignedRole")}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Assign to Roles"
              margin="dense"
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          disabled={roles.length === 0}
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              {option.label}
            </li>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            outline: "none",
            boxShadow: "none",
            "&:focus, &:active": { outline: "none", boxShadow: "none" },
          }}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          color="secondary"
          variant="contained"
          sx={{
            outline: "none",
            boxShadow: "none",
            "&:focus, &:active": { outline: "none", boxShadow: "none" },
          }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoutineDialog;
