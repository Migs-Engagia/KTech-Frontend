// ReportingManagerDialog.jsx
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  TextField, 
  MenuItem,
  Button,
  CircularProgress,
  Box,
  LinearProgress,
  Dialog as ConfirmationDialog,
  DialogTitle,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Close } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";


const ReportingManagerDialog = ({ 
  open, 
  onClose, 
  employee, 
  fetchReportingManagers,
  saveReportingManager,
  saving // Pass saving state from parent
}) => {
  const [formData, setFormData] = useState({
    reportingManagerId: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Set initial reportingManagerId from employee data when dialog opens
  useEffect(() => {
    if (open && employee) {
      setFormData({
        reportingManagerId: employee.reporting_manager_id || ''
      });
    }
  }, [open, employee]);

  // Fetch reporting managers when dialog opens
  useEffect(() => {
    if (open && fetchReportingManagers && employee) {
      const loadManagers = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetchReportingManagers(employee);
          setManagers(response || []);
        } catch (err) {
          setError('Failed to load reporting managers. Please try again.');
          console.error('Error fetching reporting managers:', err);
        } finally {
          setLoading(false);
        }
      };
      loadManagers();
    }
  }, [open, fetchReportingManagers, employee]);

  // Handle selection change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open confirmation modal
  const handleConfirmOpen = () => {
    if (formData.reportingManagerId) {
      setConfirmOpen(true);
    }
  };

  // Handle form submission after confirmation
  const handleSubmit = async () => {
    setConfirmOpen(false);
    if (formData.reportingManagerId && saveReportingManager) {
      try {
        await saveReportingManager({
          employeeId: employee.employee_id,
          reportingManagerId: formData.reportingManagerId
        });
        setFormData({ reportingManagerId: '' });
        onClose();
      } catch (err) {
        console.error('Error saving reporting manager:', err);
        // Error handling is managed by the hook's successErrorModal
      }
    }
  };

  return (
    <>
      <Dialog 
        fullScreen 
        open={open} 
        onClose={onClose}
        sx={{ '& .MuiDialog-paper': { backgroundColor: '#ffffff' } }}
      >
        {saving && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />}
         <DialogTitle
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  p: 2,
                  mb: 2
                }}
              >
               Add Reporting Manager
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Box 
            sx={{ 
              minHeight: '200px', 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2
            }}
          >
            {loading ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flex: 1 
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : error ? (
              <Typography 
                color="error" 
                variant="body1" 
                sx={{ textAlign: 'center' }}
              >
                {error}
              </Typography>
            ) : (
              <>
                <TextField
                  label="Employee Name"
                  fullWidth
                  margin="normal"
                  value={`${employee?.first_name || 'N/A'} ${employee?.last_name || 'N/A'}`}
                  disabled
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  name="reportingManagerId"
                  label="Reporting Manager"
                  fullWidth
                  margin="normal"
                  value={formData.reportingManagerId}
                  onChange={handleChange}
                  helperText={managers.length > 0 
                    ? "Select a reporting manager for this employee" 
                    : "No available reporting managers"}
                  disabled={loading || !!error || managers.length === 0 || saving}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">
                    <em>-- Select Reporting Manager --</em>
                  </MenuItem>
                  {managers.map((manager) => (
                    <MenuItem 
                      key={manager.value} 
                      value={manager.value}
                    >
                      {manager.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
          </Box>
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
                  onClick={handleConfirmOpen}
                  disabled={!formData.reportingManagerId || loading || !!error || managers.length === 0 || saving}
                  sx={{ 
                    alignSelf: 'flex-end',
                    '&:hover': { backgroundColor: 'secondary' }
                  }}
                >
                  Save
                </Button>
              </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationDialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Reporting Manager Assignment</DialogTitle>
        <DialogContentText sx={{ p: 2 }}>
          Are you sure you want to assign{' '}
          <strong>{managers.find(m => m.value === formData.reportingManagerId)?.label || 'N/A'}</strong>{' '}
          as the reporting manager for{' '}
          <strong>{employee?.first_name} {employee?.last_name}</strong>?
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={saving}>
            Confirm
          </Button>
        </DialogActions>
      </ConfirmationDialog>
    </>
  );
};

export default ReportingManagerDialog;