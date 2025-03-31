import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const steps = [
  "Personal Information",
  "Employment Details",
  "Payroll Details",
  "Statutory Deductions",
  "Attendance & Leave Information",
  "System & Access",
  "Emergency Contact Details",
  "Documents & Attachments",
];

const EmployeeDialog = ({ open, onClose, onSave, editingItem, jobRoles}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(
    editingItem || {
      employeeId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: null,
      birthPlace: "",
      sex: "",
      civilStatus: "",
      nationality: "",
      bloodType: "",
      emailAddress: "",
      contactNumber: "",
      streetNumber: "",
      streetName: "",
      barangay: "",
      cityMunicipality: "",
      province: "",
      zipCode: "",
      jobRoleCode: "", // Required field
      employmentType: "",
      department: "",
      dateOfHire: null,
    //   reportingManagerId: "",
      monthlySalary: "",
      payFrequency: "",
      paymentMode: "",
      bankAccountNumber: "",
      bankName: "",
      taxStatus: "",
      sssNumber: "",
      philhealthNumber: "",
      pagibigNumber: "",
      tinNumber: "",
      sssContribution: "",
      philhealthContribution: "",
      pagibigContribution: "",
      incomeTaxDeduction: "",
      workHours: "",
      leaveTypes: [],
      systemUserRole: "",
      username: "",
      password: "",
      systemAccessEnabled: false,
      emergencyContacts: [{ contactName: "", relationship: "", contactNumber: "", address: "" }],
      idProofs: null,
      employmentContract: null,
      resume: null,
      employeeImage: null,
    }
  );

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

   useEffect(() => {
      if (editingItem) {
        const attachments = editingItem.attachments || [];
        const idProof = attachments.find(att => att.attachment_type === "id_proof") || null;
        const empContract = attachments.find(att => att.attachment_type === "employment_contract") || null;
        const resume = attachments.find(att => att.attachment_type === "resume") || null;
        const empImage = attachments.find(att => att.attachment_type === "employee_image") || null;
  
        setFormData({
            employeeId: editingItem.employee_id || "",
            firstName: editingItem.first_name || "",
            middleName: editingItem.middle_name || "",
            lastName: editingItem.last_name || "",
            dateOfBirth: editingItem.birth_date ? dayjs(editingItem.birth_date) : null,
            birthPlace: editingItem.birth_place || "",
            sex: editingItem.sex || "",
            civilStatus: editingItem.civil_status || "",
            nationality: editingItem.nationality || "",
            bloodType: editingItem.blood_type || "",
            emailAddress: editingItem.email_address || "",
            contactNumber: editingItem.contact_number || "",
            streetNumber: editingItem.street_number || "",
            streetName: editingItem.street_name || "",
            barangay: editingItem.barangay || "",
            cityMunicipality: editingItem.city_municipality || "",
            province: editingItem.province || "",
            zipCode: editingItem.zipcode || "",
            jobRoleCode: editingItem.job_role_code || "",
            employmentType: editingItem.employment_type || "",
            department: editingItem.department || "",
            dateOfHire: editingItem.date_of_hire ? dayjs(editingItem.date_of_hire) : null,
            monthlySalary: editingItem.monthly_salary || "",
            payFrequency: editingItem.pay_frequency || "",
            paymentMode: editingItem.payment_mode || "",
            bankAccountNumber: editingItem.bank_account_number || "",
            bankName: editingItem.bank_name || "",
            taxStatus: editingItem.tax_status || "",
            sssNumber: editingItem.sss_number || "",
            philhealthNumber: editingItem.philhealth_number || "",
            pagibigNumber: editingItem.pagibig_number || "",
            tinNumber: editingItem.tin_number || "",
            sssContribution: editingItem.sss_contribution || "",
            philhealthContribution: editingItem.philhealth_contribution || "",
            pagibigContribution: editingItem.pagibig_contribution || "",
            incomeTaxDeduction: editingItem.income_tax_deduction || "",
            workHours: editingItem.work_hours || "",
            leaveTypes: editingItem.leave_types && Array.isArray(editingItem.leave_types)
          ? editingItem.leave_types.map(leave => ({
              leave_type: leave.leave_type || "", // Match backend key
              balance: leave.balance || ""
            }))
          : [],
            systemUserRole: editingItem.system_user_role || "",
            username: editingItem.username || "",
            password: "", // Do not prefill password for security
            systemAccessEnabled: !!editingItem.system_access_enabled,
            emergencyContacts: editingItem.emergency_contacts && Array.isArray(editingItem.emergency_contacts)
            ? editingItem.emergency_contacts
            : [{ contact_name: "", relationship: "", contact_number: "", address: "" }],
            idProofs: idProof ? { name: idProof.file_name, path: idProof.file_path } : null,
            employmentContract: empContract ? { name: empContract.file_name, path: empContract.file_path } : null,
            resume: resume ? { name: resume.file_name, path: resume.file_path } : null,
            employeeImage: empImage ? { name: empImage.file_name, path: empImage.file_path } : null,
        });
      } else {
        setFormData({
            employeeId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            dateOfBirth: null,
            birthPlace: "",
            sex: "",
            civilStatus: "",
            nationality: "",
            bloodType: "",
            emailAddress: "",
            contactNumber: "",
            streetNumber: "",
            streetName: "",
            barangay: "",
            cityMunicipality: "",
            province: "",
            zipCode: "",
            jobRoleCode: "", // Required field
            employmentType: "",
            department: "",
            dateOfHire: null,
          //   reportingManagerId: "",
            monthlySalary: "",
            payFrequency: "",
            paymentMode: "",
            bankAccountNumber: "",
            bankName: "",
            taxStatus: "",
            sssNumber: "",
            philhealthNumber: "",
            pagibigNumber: "",
            tinNumber: "",
            sssContribution: "",
            philhealthContribution: "",
            pagibigContribution: "",
            incomeTaxDeduction: "",
            workHours: "",
            leaveTypes: [],
            systemUserRole: "",
            username: "",
            password: "",
            systemAccessEnabled: false,
            emergencyContacts: [{ contactName: "", relationship: "", contactNumber: "", address: "" }],
            idProofs: null,
            employmentContract: null,
            resume: null,
            employeeImage: null,
        });
      }
    }, [editingItem]);

  const validateStep = (step, data = formData) => {
    const newErrors = {};

    switch (step) {
      case 0: // Personal Information
        if (!data.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
        if (!data.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!data.middleName.trim()) newErrors.middleName = "Middle Name is required";
        if (!data.lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
        else if (dayjs().diff(dayjs(data.dateOfBirth), "year") < 18)
          newErrors.dateOfBirth = "Employee must be at least 18 years old";
        if (!data.sex) newErrors.sex = "Sex is required";
        if (!data.civilStatus) newErrors.civilStatus = "Civil Status is required";
        if (!data.emailAddress) newErrors.emailAddress = "Email Address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress))
          newErrors.emailAddress = "Invalid email format";
        if (!data.contactNumber) newErrors.contactNumber = "Contact Number is required";
        else if (!/^\d{10,15}$/.test(data.contactNumber.replace(/\D/g, "")))
          newErrors.contactNumber = "Contact Number must be 10-15 digits";
        break;

      case 1: // Employment Details
        if (!data.jobRoleCode) newErrors.jobRoleCode = "Job Role is required"; // Already present, just confirming
        if (!data.employmentType) newErrors.employmentType = "Employment Type is required";
        if (!data.dateOfHire) newErrors.dateOfHire = "Date of Hire is required";
        break;

      case 2: // Payroll Details
        if (!data.monthlySalary) newErrors.monthlySalary = "Monthly Salary is required";
        else if (parseFloat(data.monthlySalary) <= 0)
          newErrors.monthlySalary = "Monthly Salary must be greater than 0";
        if (!data.payFrequency) newErrors.payFrequency = "Pay Frequency is required";
        if (!data.paymentMode) newErrors.paymentMode = "Payment Mode is required";
        if (!data.taxStatus) newErrors.taxStatus = "Tax Status is required";
        if (data.bankAccountNumber && !/^\d{10,20}$/.test(data.bankAccountNumber))
          newErrors.bankAccountNumber = "Bank Account Number must be 10-20 digits";
        break;

      case 3: // Statutory Deductions
        if (data.sssNumber && !/^\d{10}$/.test(data.sssNumber))
          newErrors.sssNumber = "SSS Number must be 10 digits";
        if (data.philhealthNumber && !/^\d{12}$/.test(data.philhealthNumber))
          newErrors.philhealthNumber = "PhilHealth Number must be 12 digits";
        if (data.pagibigNumber && !/^\d{12}$/.test(data.pagibigNumber))
          newErrors.pagibigNumber = "Pag-IBIG Number must be 12 digits";
        if (data.tinNumber && !/^\d{9,12}$/.test(data.tinNumber))
          newErrors.tinNumber = "TIN must be 9-12 digits";
        if (data.sssContribution && parseFloat(data.sssContribution) < 0)
          newErrors.sssContribution = "SSS Contribution cannot be negative";
        if (data.philhealthContribution && parseFloat(data.philhealthContribution) < 0)
          newErrors.philhealthContribution = "PhilHealth Contribution cannot be negative";
        if (data.pagibigContribution && parseFloat(data.pagibigContribution) < 0)
          newErrors.pagibigContribution = "Pag-IBIG Contribution cannot be negative";
        if (data.incomeTaxDeduction && parseFloat(data.incomeTaxDeduction) < 0)
          newErrors.incomeTaxDeduction = "Income Tax Deduction cannot be negative";
        break;

      case 4: // Attendance & Leave Information
        if (data.leaveTypes.length > 0) {
          data.leaveTypes.forEach((leave, index) => {
            if (!leave.leave_type) newErrors[`leaveTypes[${index}].leave_type`] = "Leave Type is required";
            if (!leave.balance || parseInt(leave.balance) < 0)
              newErrors[`leaveTypes[${index}].balance`] = "Leave Balance must be non-negative";
          });
        }
        break;

      case 5: // System & Access
        if (data.systemAccessEnabled) {
          if (!data.username.trim()) {
            newErrors.username = "Username is required when System Access is enabled";
          }
          if (!data.password.trim()) {
            newErrors.password = "Password is required when System Access is enabled";
          } else {
            if (data.password.length < 8) {
              newErrors.password = "Password must be at least 8 characters long";
            } else if (!/[A-Z]/.test(data.password)) {
              newErrors.password = "Password must contain at least one uppercase letter";
            } else if (!/[a-z]/.test(data.password)) {
              newErrors.password = "Password must contain at least one lowercase letter";
            } else if (!/[0-9]/.test(data.password)) {
              newErrors.password = "Password must contain at least one number";
            } else if (!/[!@#$%^&*]/.test(data.password)) {
              newErrors.password = "Password must contain at least one special character (!@#$%^&*)";
            }
          }
        }
        break;

      case 6: // Emergency Contact Details
        if (data.emergencyContacts.length > 0) {
          data.emergencyContacts.forEach((contact, index) => {
            if (contact.contactNumber && !/^\d{10,15}$/.test(contact.contactNumber.replace(/\D/g, "")))
              newErrors[`emergencyContacts[${index}].contactNumber`] = "Emergency Contact Number must be 10-15 digits";
          });
        }
        break;

      case 7: // Documents & Attachments
        // No specific validations for file uploads
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedFormData);
    validateStep(activeStep, updatedFormData); // Validate immediately on change
  };

  const handleDateChange = (name, date) => {
    const updatedFormData = {
      ...formData,
      [name]: date,
    };
    setFormData(updatedFormData);
    validateStep(activeStep, updatedFormData); // Validate immediately on change
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleRemoveFile = (name) => {
    setFormData({
      ...formData,
      [name]: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      onSave(formData, editingItem);
      onClose();
    }
  };

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    validateStep(activeStep);
  }, [activeStep]);

   // Validate the current step whenever it changes
   useEffect(() => {
    if (open) {
      validateStep(activeStep);
    }
  }, [activeStep, open, formData]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          p: 2,
        }}
      >
        {editingItem ? "Edit Employee" : "Add Employee"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Personal Information
              </Typography>
              <TextField
                name="employeeId"
                label="Employee ID"
                fullWidth
                margin="normal"
                required
                value={formData.employeeId}
                onChange={handleChange}
                error={!!errors.employeeId}
                helperText={errors.employeeId}
                disabled={!!editingItem}
              />
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                margin="normal"
                required
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                name="middleName"
                label="Middle Name"
                fullWidth
                margin="normal"
                required
                value={formData.middleName}
                onChange={handleChange}
                error={!!errors.middleName}
                helperText={errors.middleName}
              />
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                required
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                  onChange={(date) => handleDateChange("dateOfBirth", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth,
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField
                name="birthPlace"
                label="Birth Place"
                fullWidth
                margin="normal"
                value={formData.birthPlace}
                onChange={handleChange}
              />
              <TextField
                select
                name="sex"
                label="Sex"
                fullWidth
                margin="normal"
                required
                value={formData.sex}
                onChange={handleChange}
                error={!!errors.sex}
                helperText={errors.sex}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField
                select
                name="civilStatus"
                label="Civil Status"
                fullWidth
                margin="normal"
                required
                value={formData.civilStatus}
                onChange={handleChange}
                error={!!errors.civilStatus}
                helperText={errors.civilStatus}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </TextField>
              <TextField
                name="nationality"
                label="Nationality"
                fullWidth
                margin="normal"
                value={formData.nationality}
                onChange={handleChange}
              />
              <TextField
                name="bloodType"
                label="Blood Type"
                fullWidth
                margin="normal"
                value={formData.bloodType}
                onChange={handleChange}
              />
              <TextField
                name="emailAddress"
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                required
                value={formData.emailAddress}
                onChange={handleChange}
                error={!!errors.emailAddress}
                helperText={errors.emailAddress}
              />
              <TextField
                name="contactNumber"
                label="Contact Number"
                fullWidth
                margin="normal"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
              <TextField
                name="streetNumber"
                label="Street No./Lot No., Block No."
                fullWidth
                margin="normal"
                value={formData.streetNumber}
                onChange={handleChange}
              />
              <TextField
                name="streetName"
                label="Street Name"
                fullWidth
                margin="normal"
                value={formData.streetName}
                onChange={handleChange}
              />
              <TextField
                name="barangay"
                label="Barangay"
                fullWidth
                margin="normal"
                value={formData.barangay}
                onChange={handleChange}
              />
              <TextField
                name="cityMunicipality"
                label="Municipality/City"
                fullWidth
                margin="normal"
                value={formData.cityMunicipality}
                onChange={handleChange}
              />
              <TextField
                name="province"
                label="Province"
                fullWidth
                margin="normal"
                value={formData.province}
                onChange={handleChange}
              />
              <TextField
                name="zipCode"
                label="Zip Code"
                fullWidth
                margin="normal"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Employment Details
              </Typography>
              <TextField
                select
                name="jobRoleCode"
                label="Job Role"
                fullWidth
                margin="normal"
                required
                value={formData.jobRoleCode}
                onChange={handleChange}
                error={!!errors.jobRoleCode}
                helperText={errors.jobRoleCode}
              >
                <MenuItem value="" disabled>
                  -- Select Job Role --
                </MenuItem>
                {jobRoles.map((role) => (
                  <MenuItem key={role.code} value={role.code}>
                    {role.official_designation}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                name="employmentType"
                label="Employment Type"
                fullWidth
                margin="normal"
                required
                value={formData.employmentType}
                onChange={handleChange}
                error={!!errors.employmentType}
                helperText={errors.employmentType}
              >
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="Part-Time">Part-Time</MenuItem>
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </TextField>
              <TextField
                name="department"
                label="Department"
                fullWidth
                margin="normal"
                value={formData.department}
                onChange={handleChange}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Hire"
                  value={formData.dateOfHire ? dayjs(formData.dateOfHire) : null}
                  onChange={(date) => handleDateChange("dateOfHire", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      error: !!errors.dateOfHire,
                      helperText: errors.dateOfHire,
                    },
                  }}
                />
              </LocalizationProvider>
              {/* <TextField
                select
                name="reportingManagerId"
                label="Reporting Manager"
                fullWidth
                margin="normal"
                value={formData.reportingManagerId}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  -- Select Reporting Manager --
                </MenuItem>
                {reportingManagers.map((manager) => (
                  <MenuItem key={manager.value} value={manager.value}>
                    {manager.label}
                  </MenuItem>
                ))}
              </TextField> */}
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Payroll Details
              </Typography>
              <TextField
                name="monthlySalary"
                label="Monthly Salary"
                type="number"
                fullWidth
                margin="normal"
                required
                value={formData.monthlySalary}
                onChange={handleChange}
                error={!!errors.monthlySalary}
                helperText={errors.monthlySalary}
              />
              <TextField
                select
                name="payFrequency"
                label="Pay Frequency"
                fullWidth
                margin="normal"
                required
                value={formData.payFrequency}
                onChange={handleChange}
                error={!!errors.payFrequency}
                helperText={errors.payFrequency}
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
              </TextField>
              <TextField
                select
                name="paymentMode"
                label="Payment Mode"
                fullWidth
                margin="normal"
                required
                value={formData.paymentMode}
                onChange={handleChange}
                error={!!errors.paymentMode}
                helperText={errors.paymentMode}
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </TextField>
              <TextField
                name="bankAccountNumber"
                label="Bank Account Number"
                fullWidth
                margin="normal"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                error={!!errors.bankAccountNumber}
                helperText={errors.bankAccountNumber}
              />
              <TextField
                name="bankName"
                label="Bank Name"
                fullWidth
                margin="normal"
                value={formData.bankName}
                onChange={handleChange}
              />
              <TextField
                select
                name="taxStatus"
                label="Tax Status"
                fullWidth
                margin="normal"
                required
                value={formData.taxStatus}
                onChange={handleChange}
                error={!!errors.taxStatus}
                helperText={errors.taxStatus}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
              </TextField>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Statutory Deductions
              </Typography>
              <TextField
                name="sssNumber"
                label="SSS Number"
                fullWidth
                margin="normal"
                value={formData.sssNumber}
                onChange={handleChange}
                error={!!errors.sssNumber}
                helperText={errors.sssNumber}
              />
              <TextField
                name="philhealthNumber"
                label="PhilHealth Number"
                fullWidth
                margin="normal"
                value={formData.philhealthNumber}
                onChange={handleChange}
                error={!!errors.philhealthNumber}
                helperText={errors.philhealthNumber}
              />
              <TextField
                name="pagibigNumber"
                label="Pag-IBIG Number"
                fullWidth
                margin="normal"
                value={formData.pagibigNumber}
                onChange={handleChange}
                error={!!errors.pagibigNumber}
                helperText={errors.pagibigNumber}
              />
              <TextField
                name="tinNumber"
                label="TIN (Tax Identification Number)"
                fullWidth
                margin="normal"
                value={formData.tinNumber}
                onChange={handleChange}
                error={!!errors.tinNumber}
                helperText={errors.tinNumber}
              />
              <TextField
                name="sssContribution"
                label="SSS Contribution"
                type="number"
                fullWidth
                margin="normal"
                value={formData.sssContribution}
                onChange={handleChange}
                error={!!errors.sssContribution}
                helperText={errors.sssContribution}
              />
              <TextField
                name="philhealthContribution"
                label="PhilHealth Contribution"
                type="number"
                fullWidth
                margin="normal"
                value={formData.philhealthContribution}
                onChange={handleChange}
                error={!!errors.philhealthContribution}
                helperText={errors.philhealthContribution}
              />
              <TextField
                name="pagibigContribution"
                label="Pag-IBIG Contribution"
                type="number"
                fullWidth
                margin="normal"
                value={formData.pagibigContribution}
                onChange={handleChange}
                error={!!errors.pagibigContribution}
                helperText={errors.pagibigContribution}
              />
              <TextField
                name="incomeTaxDeduction"
                label="Income Tax Deduction"
                type="number"
                fullWidth
                margin="normal"
                value={formData.incomeTaxDeduction}
                onChange={handleChange}
                error={!!errors.incomeTaxDeduction}
                helperText={errors.incomeTaxDeduction}
              />
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Attendance & Leave Information
              </Typography>
              <TextField
                select
                name="workHours"
                label="Work Hours"
                fullWidth
                margin="normal"
                value={formData.workHours}
                onChange={handleChange}
              >
                <MenuItem value="8">8 Hours</MenuItem>
                <MenuItem value="10">10 Hours</MenuItem>
              </TextField>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Leave Types
              </Typography>
              {formData.leaveTypes.map((leave, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label="Leave Type"
                    value={leave.leave_type || ""}
                    onChange={(e) => {
                      const newLeaveTypes = [...formData.leaveTypes];
                      newLeaveTypes[index] = { ...newLeaveTypes[index], leaveType: e.target.value };
                      setFormData({ ...formData, leaveTypes: newLeaveTypes });
                    }}
                    fullWidth
                    error={!!errors[`leaveTypes[${index}].leave_type`]}
                    helperText={errors[`leaveTypes[${index}].leave_type`]}
                  >
                    <MenuItem value="Vacation">Vacation</MenuItem>
                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                    <MenuItem value="Maternity">Maternity</MenuItem>
                    <MenuItem value="Paternity">Paternity</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                  </TextField>
                  <TextField
                    label="Balance"
                    type="number"
                    value={leave.balance || ""}
                    onChange={(e) => {
                      const newLeaveTypes = [...formData.leaveTypes];
                      newLeaveTypes[index] = { ...newLeaveTypes[index], balance: e.target.value };
                      setFormData({ ...formData, leaveTypes: newLeaveTypes });
                    }}
                    fullWidth
                    error={!!errors[`leaveTypes[${index}].balance`]}
                    helperText={errors[`leaveTypes[${index}].balance`]}
                  />
                  <IconButton
                    onClick={() => {
                      const newLeaveTypes = formData.leaveTypes.filter((_, i) => i !== index);
                      setFormData({ ...formData, leaveTypes: newLeaveTypes });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() => setFormData({ ...formData, leaveTypes: [...formData.leaveTypes, { leaveType: "", balance: "" }] })}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Leave Type
              </Button>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                System & Access
              </Typography>
              <TextField
                select
                name="systemUserRole"
                label="Role"
                fullWidth
                margin="normal"
                value={formData.systemUserRole}
                onChange={handleChange}
              >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
              <TextField
                name="username"
                label="Username"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="systemAccessEnabled"
                    checked={formData.systemAccessEnabled}
                    onChange={handleChange}
                  />
                }
                label="System Access Enabled"
              />
            </div>
          )}

          {activeStep === 6 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Emergency Contact Details
              </Typography>
              {formData.emergencyContacts.map((contact, index) => (
                <Box key={index} sx={{ mb: 2, border: "1px solid #ddd", p: 2 }}>
                  <TextField
                    name={`emergencyContacts[${index}].contact_name`}
                    label="Emergency Contact Name"
                    fullWidth
                    margin="normal"
                    value={contact.contact_name}
                    onChange={(e) => {
                      const newContacts = [...formData.emergencyContacts];
                      newContacts[index] = { ...newContacts[index], contact_name: e.target.value };
                      setFormData({ ...formData, emergencyContacts: newContacts });
                    }}
                  />
                  <TextField
                    name={`emergencyContacts[${index}].relationship`}
                    label="Relationship"
                    fullWidth
                    margin="normal"
                    value={contact.relationship}
                    onChange={(e) => {
                      const newContacts = [...formData.emergencyContacts];
                      newContacts[index] = { ...newContacts[index], relationship: e.target.value };
                      setFormData({ ...formData, emergencyContacts: newContacts });
                    }}
                  />
                  <TextField
                    name={`emergencyContacts[${index}].contact_number`}
                    label="Contact Number"
                    fullWidth
                    margin="normal"
                    value={contact.contact_number}
                    onChange={(e) => {
                      const newContacts = [...formData.emergencyContacts];
                      newContacts[index] = { ...newContacts[index], contact_number: e.target.value };
                      setFormData({ ...formData, emergencyContacts: newContacts });
                    }}
                    error={!!errors[`emergencyContacts[${index}].contact_number`]}
                    helperText={errors[`emergencyContacts[${index}].contact_number`]}
                  />
                  <TextField
                    name={`emergencyContacts[${index}].address`}
                    label="Address"
                    fullWidth
                    margin="normal"
                    value={contact.address}
                    onChange={(e) => {
                      const newContacts = [...formData.emergencyContacts];
                      newContacts[index] = { ...newContacts[index], address: e.target.value };
                      setFormData({ ...formData, emergencyContacts: newContacts });
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
                      setFormData({ ...formData, emergencyContacts: newContacts });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    emergencyContacts: [
                      ...formData.emergencyContacts,
                      { contactName: "", relationship: "", contactNumber: "", address: "" },
                    ],
                  })
                }
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Emergency Contact
              </Button>
            </div>
          )}

          {activeStep === 7 && (
            <div>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Documents & Attachments
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                  Upload ID Proofs
                  <input type="file" name="idProofs" hidden onChange={handleFileChange} />
                </Button>
                {formData.idProofs && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formData.idProofs.name}
                    </Typography>
                    <IconButton color="error" onClick={() => handleRemoveFile("idProofs")}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                  Upload Employment Contract
                  <input type="file" name="employmentContract" hidden onChange={handleFileChange} />
                </Button>
                {formData.employmentContract && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formData.employmentContract.name}
                    </Typography>
                    <IconButton color="error" onClick={() => handleRemoveFile("employmentContract")}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                  Upload Resume
                  <input type="file" name="resume" hidden onChange={handleFileChange} />
                </Button>
                {formData.resume && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formData.resume.name}
                    </Typography>
                    <IconButton color="error" onClick={() => handleRemoveFile("resume")}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                  Upload Employee Image
                  <input type="file" name="employeeImage" hidden onChange={handleFileChange} />
                </Button>
                {formData.employeeImage && (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formData.employeeImage.name}
                    </Typography>
                    <IconButton color="error" onClick={() => handleRemoveFile("employeeImage")}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </div>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          color="primary"
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            Save
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;