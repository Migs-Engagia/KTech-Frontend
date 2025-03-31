import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PerformanceDialog = ({
  open,
  onClose,
  employeeId,
  jobRoles = [],
  reportingManagers = [],
  fetchReportingManagers, // Add this prop
  onSave,
  employee, // Add employee prop for fetchReportingManagers
}) => {
  const [formData, setFormData] = useState({
    performanceRating: "",
    appraisalDate: null,
    promotions: [
      {
        promotionDate: null,
        newJobRoleId: "",
        salaryIncrease: "",
        reason: "",
        promotingManagerId: "",
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        performanceRating: "",
        appraisalDate: null,
        promotions: [
          {
            promotionDate: null,
            newJobRoleId: "",
            salaryIncrease: "",
            reason: "",
            promotingManagerId: "",
          },
        ],
      });
      setErrors({});

      // Fetch reporting managers when dialog opens
      if (fetchReportingManagers && employee) {
        setLoadingManagers(true);
        fetchReportingManagers(employee)
          .then(() => setLoadingManagers(false))
          .catch(() => setLoadingManagers(false));
      }
    }
  }, [open, employeeId, fetchReportingManagers, employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      if (name.includes("promotions")) {
        const [_, index, field] = name.match(/promotions\[(\d+)\]\.(.+)/);
        const updatedPromotions = [...prev.promotions];
        updatedPromotions[index][field] = value;
        return { ...prev, promotions: updatedPromotions };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => {
      if (field.includes("promotions")) {
        const [_, index, fieldName] = field.match(/promotions\[(\d+)\]\.(.+)/);
        const updatedPromotions = [...prev.promotions];
        updatedPromotions[index][fieldName] = date
          ? date.format("YYYY-MM-DD")
          : null;
        return { ...prev, promotions: updatedPromotions };
      }
      return { ...prev, [field]: date ? date.format("YYYY-MM-DD") : null };
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addPromotion = () => {
    setFormData((prev) => ({
      ...prev,
      promotions: [
        ...prev.promotions,
        {
          promotionDate: null,
          newJobRoleId: "",
          salaryIncrease: "",
          reason: "",
          promotingManagerId: "",
        },
      ],
    }));
  };

  const removePromotion = (index) => {
    setFormData((prev) => ({
      ...prev,
      promotions: prev.promotions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.performanceRating)
      newErrors.performanceRating = "Performance rating is required";
    if (!formData.appraisalDate)
      newErrors.appraisalDate = "Appraisal date is required";
    formData.promotions.forEach((promo, index) => {
      if (!promo.promotionDate)
        newErrors[`promotions[${index}].promotionDate`] =
          "Promotion date is required";
      if (!promo.newJobRoleId)
        newErrors[`promotions[${index}].newJobRoleId`] =
          "New job role is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSave) {
      onSave({ employeeId, ...formData });
    }
    onClose();
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Performance and Promotion
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            name="performanceRating"
            label="Performance Rating"
            fullWidth
            margin="normal"
            value={formData.performanceRating}
            onChange={handleChange}
            error={!!errors.performanceRating}
            helperText={errors.performanceRating || "Select a rating from 1-5"}
          >
            <MenuItem value="">
              <em>-- Select Rating --</em>
            </MenuItem>
            {[1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Appraisal Date"
              value={
                formData.appraisalDate ? dayjs(formData.appraisalDate) : null
              }
              onChange={(date) => handleDateChange("appraisalDate", date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.appraisalDate,
                  helperText: errors.appraisalDate,
                },
              }}
            />
          </LocalizationProvider>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Promotions
          </Typography>
          {formData.promotions.map((promotion, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                border: "1px solid #ddd",
                p: 2,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Promotion Date"
                      value={
                        promotion.promotionDate
                          ? dayjs(promotion.promotionDate)
                          : null
                      }
                      onChange={(date) =>
                        handleDateChange(
                          `promotions[${index}].promotionDate`,
                          date
                        )
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          error: !!errors[`promotions[${index}].promotionDate`],
                          helperText:
                            errors[`promotions[${index}].promotionDate`],
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    name={`promotions[${index}].newJobRoleId`}
                    label="New Job Role"
                    fullWidth
                    margin="normal"
                    value={promotion.newJobRoleId || ""}
                    onChange={handleChange}
                    error={!!errors[`promotions[${index}].newJobRoleId`]}
                    // helperText={
                    //   errors[`promotions[${index}].newJobRoleId`] ||
                    //   "Select a new job role"
                    // }
                  >
                    <MenuItem value="">
                      <em>-- Select New Job Role --</em>
                    </MenuItem>
                    {jobRoles.map((role) => (
                      <MenuItem key={role.code} value={role.code}>
                        {role.official_designation}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    name={`promotions[${index}].salaryIncrease`}
                    label="Salary Increase"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={promotion.salaryIncrease || ""}
                    onChange={handleChange}
                    error={!!errors[`promotions[${index}].salaryIncrease`]}
                    helperText={errors[`promotions[${index}].salaryIncrease`]}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    name={`promotions[${index}].promotingManagerId`}
                    label="Promoting Manager"
                    fullWidth
                    margin="normal"
                    value={promotion.promotingManagerId || ""}
                    onChange={handleChange}
                    disabled={loadingManagers}
                  >
                    <MenuItem value="">
                      <em>-- Select Promoting Manager --</em>
                    </MenuItem>
                    {loadingManagers ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : (
                      reportingManagers.map((manager) => (
                        <MenuItem key={manager.value} value={manager.value}>
                          {manager.label}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => removePromotion(index)}
                    color="error"
                    disabled={formData.promotions.length === 1}
                    sx={{ mt: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    name={`promotions[${index}].reason`}
                    label="Reason"
                    fullWidth
                    margin="normal"
                    value={promotion.reason || ""}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            onClick={addPromotion}
            variant="outlined"
            sx={{ mt: 1, alignSelf: "flex-start" }}
          >
            Add Promotion
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ mt: 2, alignSelf: "flex-end" }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceDialog;
