import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import { AxiosInstance } from "../utils/axiosInstance";
import ProgressModal from "./ProgressModal";
import ConfirmationModal from "./ConfirmationModal";
import SuccessErrorModal from "./SuccessErrorModal";

const steps = [
  "Position Basics",
  "Responsibilities & Interfaces",
  "Qualifications & Skills",
  "Application Screening & Career Progression",
];

function CreateJobRoleAndDescriptionDialog({ open, onClose }) {
  const axios = AxiosInstance();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successErrorModal, setSuccessErrorModal] = useState({ open: false, type: "", message: "" });

  const [formValues, setFormValues] = useState({
    roleCode: "",
    officialDesignation: "",
    jobClassification: "",
    baseOperations: "",
    clientFacing: "",
    fieldWork: "",
    physicalRigor: "",
    primaryResponsibility: "",
    keyResultAreas: "",
    keyTasks: "",
    internalInterface: "",
    externalInterface: "",
    workExperience: "",
    degreeRequirement: "",
    knowledgeRequirements: "",
    skillRequirements: "",
    personalCharacteristics: "",
    interpersonalSkills: "",
    niceToHaveSkills: "",
    exam: "",
    interviewers: [],
    onboardingTraining: "",
    careerShortTerm: "",
    careerLongTerm: "",
  });

  // Handle text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multi-select change
  const handleAutocompleteChange = (event, value) => {
    setFormValues((prev) => ({ ...prev, interviewers: value }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return formValues.roleCode.trim() !== "" && formValues.officialDesignation.trim() !== "";
    }
    return true;
  };

  // const objectToFormData = (object) => {
  //   const formData = new FormData();
  //   Object.keys(object).forEach((key) => formData.append(key, object[key]));
  //   return formData;
  // };

  const handleSubmit = async () => {
    setConfirmOpen(false);
    setLoading(true);
   
    try {
      // const formData = objectToFormData({ formValues });
      const options = {
        method: "POST",
        url: "/JobRolesAndDescription/saveJobRoles.json",
        data: formValues,
      };

      const response = await axios(options);
       
        const responseData = response.data[0];

        if (responseData.is_success) {
            setSuccessErrorModal({ open: true, type: "success", message: responseData.message });
            onClose();
        } else {
            setSuccessErrorModal({ open: true, type: "error", message: "Failed to create job role. Try again!" });
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSuccessErrorModal({ open: true, type: "error", message: "Failed to create job role. Try again!" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          p: 2,
        }}
      >
        CREATE JOB ROLES AND DESCRIPTION
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", right: 10, top: 10, "&:focus": { outline: "none" } }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Job Requirements & Responsibilities */}
        {activeStep === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              JOB DESIGNATION AND DESCRIPTION
            </Typography>
            <TextField
              label="Role Code*"
              fullWidth
              name="roleCode"
              value={formValues.roleCode}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Official Designation*"
              fullWidth
              name="officialDesignation"
              value={formValues.officialDesignation}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Job Classification"
              fullWidth
              name="jobClassification"
              value={formValues.jobClassification}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                select
                label="Base Operations"
                fullWidth
                name="baseOperations"
                value={formValues.baseOperations}
                onChange={handleInputChange}
              >
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
              <TextField
                select
                label="Client Facing"
                fullWidth
                name="clientFacing"
                value={formValues.clientFacing}
                onChange={handleInputChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Frequently">Frequently</MenuItem>
                <MenuItem value="Occasionally">Occasionally</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                select
                label="Field Work"
                fullWidth
                name="fieldWork"
                value={formValues.fieldWork}
                onChange={handleInputChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Frequently">Frequently</MenuItem>
                <MenuItem value="Occasionally">Occasionally</MenuItem>
              </TextField>
              <TextField
                select
                label="Physical Rigor Requirement"
                fullWidth
                name="physicalRigor"
                value={formValues.physicalRigor}
                onChange={handleInputChange}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Box>
            <TextField
              label="Primary Responsibility"
              name="primaryResponsibility"
              value={formValues.primaryResponsibility}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={8}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Step 2: Keys and Interfaces */}
        {activeStep === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              KEYS AND INTERFACES
            </Typography>
            <TextField
              label="Key Result Areas"
              name="keyResultAreas"
              value={formValues.keyResultAreas}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Key Tasks"
              fullWidth
              name="keyTasks"
              value={formValues.keyTasks}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Internal Interface"
              fullWidth
              name="internalInterface"
              value={formValues.internalInterface}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="External Interface"
              fullWidth
              name="externalInterface"
              value={formValues.externalInterface}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Step 3: Work Experience & Skills */}
        {activeStep === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              WORK EXPERIENCE REQUIREMENT
            </Typography>
            <TextField
              label="Work Experience Requirement"
              fullWidth
              name="workExperience" value={formValues.workExperience} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              DEGREE, KNOWLEDGE AND SKILL REQUIREMENTS
            </Typography>
            <TextField
              label="Degree Requirement"
              fullWidth
              name="degreeRequirement" value={formValues.degreeRequirement} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Knowledge Requirements"
              fullWidth
              name="knowledgeRequirements" value={formValues.knowledgeRequirements} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Skill Requirements"
              fullWidth
              multiline
              name="skillRequirements" value={formValues.skillRequirements} onChange={handleInputChange}
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Personal Characteristics"
              fullWidth
              name="personalCharacteristics" value={formValues.personalCharacteristics} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Interpersonal Skills Requirements"
              fullWidth
              name="interpersonalSkills" value={formValues.interpersonalSkills} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nice-to-Have Skills"
              fullWidth
              name="niceToHaveSkills" value={formValues.niceToHaveSkills} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Step 4: Application Screening & Career Progression */}
        {activeStep === 3 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              APPLICATION SCREENING
            </Typography>
            <TextField label="Exam" fullWidth name="exam" value={formValues.exam} onChange={handleInputChange} sx={{ mb: 2 }} />

            {/* Multi-select Interviewers field */}
            <Autocomplete
              multiple
              options={[
                "Software Manager",
                "HR Manager",
                "Tech Lead",
                "Project Manager",
              ]}
              value={formValues.interviewers} onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField {...params} label="Interviewers" fullWidth />
              )}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Onboarding Training to be provided"
              fullWidth
              name="onboardingTraining" value={formValues.onboardingTraining} onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              CAREER PROGRESSION
            </Typography>
            <TextField label="Short Term" fullWidth name="careerShortTerm" value={formValues.careerShortTerm} onChange={handleInputChange}  sx={{ mb: 2 }} />
            <TextField label="Long Term" fullWidth name="careerLongTerm" value={formValues.careerLongTerm} onChange={handleInputChange} sx={{ mb: 2 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            color="black"
            sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus, &:active": { outline: "none", boxShadow: "none" },
            }}
          >
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
             disabled={!isStepValid()}
            variant="contained"
            color="primary"
            sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus, &:active": { outline: "none", boxShadow: "none" },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => setConfirmOpen(true)}
            variant="contained"
            color="secondary"
            sx={{
              outline: "none",
              boxShadow: "none",
              "&:focus, &:active": { outline: "none", boxShadow: "none" },
            }}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>

    {/* Progress Modal */}
    <ProgressModal open={loading} message="Saving job role details..." />

    {/* Confirmation Modal */}
    <ConfirmationModal
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleSubmit}
      title="Confirm Submission"
      message="Are you sure you want to submit the job role details?"
    />

    {/* Success/Error Modal */}
    <SuccessErrorModal
      open={successErrorModal.open}
      onClose={() => setSuccessErrorModal({ open: false })}
      type={successErrorModal.type}
      message={successErrorModal.message}
    />
  </>
  );
}

export default CreateJobRoleAndDescriptionDialog;
