import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  MenuItem,
  DialogActions
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CloseIcon from "@mui/icons-material/Close";


const ExitDialog = ({ open, onClose, employeeId, onSave }) => {
  // Initial form state
  const initialFormData = {
    exitDetails: {
      resignationDate: null,
      lastWorkingDay: null,
      reasonForLeaving: '',
      exitInterviewNote: '',
      finalSettlementAmount: '',
      exitClearanceStatus: 'Pending',
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Handle text field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle date picker changes
  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      exitDetails: {
        ...prev.exitDetails,
        [field]: date ? date.format('YYYY-MM-DD') : null,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    const { resignationDate, lastWorkingDay, finalSettlementAmount } = formData.exitDetails;

    if (!resignationDate) {
      newErrors['exitDetails.resignationDate'] = 'Resignation date is required';
    }
    if (!lastWorkingDay) {
      newErrors['exitDetails.lastWorkingDay'] = 'Last working day is required';
    }
    if (finalSettlementAmount && isNaN(finalSettlementAmount)) {
      newErrors['exitDetails.finalSettlementAmount'] = 'Final settlement amount must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save action
  const handleSave = () => {
    if (validateForm()) {
      const exitData = {
        employeeId,
        ...formData.exitDetails,
      };
      onSave(exitData);
      setFormData(initialFormData); // Reset form after save
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
       <DialogTitle
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "white",
                        p: 2,
                        mb: 2
                      }}
                    >
                     Exit Information
                      <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Resignation Date"
            value={formData.exitDetails.resignationDate ? dayjs(formData.exitDetails.resignationDate) : null}
            onChange={(date) => handleDateChange('resignationDate', date)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: !!errors['exitDetails.resignationDate'],
                helperText: errors['exitDetails.resignationDate'],
              },
            }}
          />
          <DatePicker
            label="Last Working Day"
            value={formData.exitDetails.lastWorkingDay ? dayjs(formData.exitDetails.lastWorkingDay) : null}
            onChange={(date) => handleDateChange('lastWorkingDay', date)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: !!errors['exitDetails.lastWorkingDay'],
                helperText: errors['exitDetails.lastWorkingDay'],
              },
            }}
          />
        </LocalizationProvider>
        <TextField
          name="exitDetails.reasonForLeaving"
          label="Reason for Leaving"
          fullWidth
          margin="normal"
          value={formData.exitDetails.reasonForLeaving}
          onChange={handleChange}
        />
        <TextField
          name="exitDetails.exitInterviewNote"
          label="Exit Interview Notes"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={formData.exitDetails.exitInterviewNote}
          onChange={handleChange}
        />
        <TextField
          name="exitDetails.finalSettlementAmount"
          label="Final Settlement Amount"
          type="number"
          fullWidth
          margin="normal"
          value={formData.exitDetails.finalSettlementAmount}
          onChange={handleChange}
          error={!!errors['exitDetails.finalSettlementAmount']}
          helperText={errors['exitDetails.finalSettlementAmount']}
        />
        <TextField
          select
          name="exitDetails.exitClearanceStatus"
          label="Exit Clearance Status"
          fullWidth
          margin="normal"
          value={formData.exitDetails.exitClearanceStatus}
          onChange={handleChange}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Not Required">Not Required</MenuItem>
        </TextField>
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
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                       
                        sx={{ 
                          alignSelf: 'flex-end',
                          '&:hover': { backgroundColor: 'secondary' }
                        }}
                      >
                        Save
                      </Button>
                    </DialogActions>
    </Dialog>
  );
};

export default ExitDialog;