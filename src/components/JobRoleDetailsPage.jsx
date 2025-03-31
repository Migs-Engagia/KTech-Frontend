import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosInstance } from "../utils/axiosInstance";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditJobRoleAndDescriptionDialog from "./EditJobRoleAndDescriptionDialog";


function JobRoleDetailsPage() {
  const { jobCode } = useParams();
  const axios = AxiosInstance();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const objectToFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  };

  // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedJobRole, setSelectedJobRole] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const formData = objectToFormData({ job_code: jobCode });
        const options = {
          method: "POST",
          url: "/JobRolesAndDescription/getJobRoleDetails.json",
          data: formData,
        };

        const response = await axios(options);
        setJobDetails(response.data.data);
      } catch (err) {
        setError("Failed to fetch job role details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobCode]);

  const handleEdit = (job) => {
    setSelectedJobRole(job);
    setEditDialogOpen(true);
  };


  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Make sure it takes full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1024, margin: "auto", padding: 1 }}>
      <Card sx={{ marginBottom: 2, boxShadow: 2 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">
              {jobDetails?.official_designation}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(jobDetails?.code)}
              sx={{
                outline: "none",
                boxShadow: "none",
                "&:focus, &:active": { outline: "none", boxShadow: "none" },
              }}
            >
              Edit
            </Button>
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body2">
            <strong>Job Role Code:</strong> {jobDetails?.code}
          </Typography>
          <Typography variant="body2">
            <strong>Job Classification:</strong>{" "}
            {jobDetails?.job_classification}
          </Typography>
          <Typography variant="body2">
            <strong>Base Operations:</strong> {jobDetails?.base_operations}
          </Typography>
          <Typography variant="body2">
            <strong>Client Facing:</strong> {jobDetails?.client_facing}
          </Typography>
          <Typography variant="body2">
            <strong>Field Work:</strong> {jobDetails?.field_work}
          </Typography>
          <Typography variant="body2">
            <strong>Physical Rigor Requirement:</strong>{" "}
            {jobDetails?.physical_rigor_requirement}
          </Typography>
          <Typography variant="body2">
            <strong>Primary Responsibilities</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.primary_responsibility}
          </Typography>
        </CardContent>
      </Card>

      <Accordion defaultExpanded={true} sx={{ marginBottom: 2, boxShadow: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Responsibilities & Interfaces
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <strong>Key Result Areas</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.key_result_areas}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Key Tasks</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.key_tasks}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Internal Interface</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.internal_interface}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>External Interface</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.external_interface}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true} sx={{ marginBottom: 2, boxShadow: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Qualifications & Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <strong>Work Experience Requirement</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.work_experience_requirements}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Degree Requirement</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.degree_requirements}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Knowledge Requirements</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.knowledge_requirements}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Skill Requirements</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.skill_requirements}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Personal Characteristics</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.personal_characteristics}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Interpersonal Skills Requirements</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.interpersonal_skill_requirements}
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="body2">
            <strong>Nice-to-Have Skills</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.nice_to_have_skills}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true} sx={{ marginBottom: 2, boxShadow: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Application Screening</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <strong>Examination:</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.examination}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body2">
            <strong>Interviewers:</strong>
          </Typography>
          <div>
            {jobDetails?.job_role_interviewers?.map((interviewer, index) => (
              <Typography variant="body2" key={index} whiteSpace="pre-line">
                {interviewer.interviewer}
              </Typography>
            ))}
          </div>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body2">
            <strong>Onboarding Training to be provided:</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.onboaring_training_to_be_provided}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true} sx={{ marginBottom: 2, boxShadow: 2,  }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Career Progression</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            <strong>Short Term:</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.career_progress_short_term}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body2">
            <strong>Long Term:</strong>
          </Typography>
          <Typography variant="body2" whiteSpace="pre-line">
            {jobDetails?.career_progress_long_term}
          </Typography>
        </AccordionDetails>
      </Accordion>

       {/* Edit Job Role Dialog */}
       {editDialogOpen && (
        <EditJobRoleAndDescriptionDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          jobData={selectedJobRole}
        />
      )}
    </Box>
  );
}

export default JobRoleDetailsPage;
