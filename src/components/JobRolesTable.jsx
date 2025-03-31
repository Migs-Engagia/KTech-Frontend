import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Subordinates from "./Subordinates";
import EditJobRoleAndDescriptionDialog from "./EditJobRoleAndDescriptionDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { AxiosInstance } from "../utils/axiosInstance";

function JobRolesTable({ jobRolesData }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJobCode, setSelectedJobCode] = useState(null);
  const [selectedOfficialDesignation, setSelectedOfficialDesignation] =
    useState(null);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJobRole, setSelectedJobRole] = useState(null);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobRoleToDelete, setJobRoleToDelete] = useState(null);
  const axios = AxiosInstance();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (jobCode) => {
    window.open(`/job-roles/${jobCode}`, "_blank");
  };

  const handleGroup = (job) => {
    setSelectedJobCode(job.code);
    setSelectedOfficialDesignation(job.official_designation);
    setOpenDialog(true);
  };

  const handleEdit = (job) => {
    setSelectedJobRole(job.code);
    setEditDialogOpen(true);
  };

  const handleDelete = (job) => {
    setJobRoleToDelete(job.code); // Set the job role to delete
    setSelectedOfficialDesignation(job.official_designation);
    setDeleteDialogOpen(true); // Open the confirmation modal
  };

  const objectToFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  };

  const confirmDelete = async () => {
    if (!jobRoleToDelete) return;

    try {
      const formData = objectToFormData({ job_code: jobRoleToDelete });
      const options = {
        method: "POST",
        url: "/JobRolesAndDescription/deleteJobRole.json",
        data: formData,
      };

      const response = await axios(options);

      if (response.data.is_success) {
        setModalType("success");
        setModalMessage(
          `Job role "${selectedOfficialDesignation}" deleted successfully.`
        );
        setModalOpen(true);
        onDeleteSuccess(jobRoleToDelete); // Refresh the list after deletion
      } else {
        setModalType("error");
        setModalMessage("Failed to delete job role. Please try again.");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting job role:", error);
      setModalType("error");
      setModalMessage("An error occurred while deleting the job role.");
      setModalOpen(true);
    }

    setDeleteDialogOpen(false);
    setJobRoleToDelete(null);
  };

  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job Role Code</TableCell>
              <TableCell>Official Designation</TableCell>
              <TableCell>Job Classification</TableCell>
              <TableCell>Report to</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(jobRolesData) &&
              jobRolesData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job, index) => (
                  <TableRow key={index}>
                    <TableCell>{job.code}</TableCell>
                    <TableCell>{job.official_designation}</TableCell>
                    <TableCell>{job.job_classification}</TableCell>
                    <TableCell>{job.role_name || "N/A"}</TableCell>
                    <TableCell>
                      <Tooltip title="View Job Role Details" arrow>
                       
                          <IconButton
                            sx={{
                              p: 0.5,
                              color: "#9C27B0",
                              "&:focus": { outline: "none" },
                            }}
                            onClick={() => handleView(job.code)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View Subordinates" arrow>
                          <IconButton
                            sx={{
                              p: 0.5,
                              color: "#673AB7",
                              "&:focus": { outline: "none" },
                            }} // Deep Purple 500
                            onClick={() => handleGroup(job)}
                          >
                            <GroupIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit" arrow>
                          <IconButton
                            sx={{
                              p: 0.5,
                              color: "#FFC107",
                              "&:focus": { outline: "none" },
                            }} // Amber 500
                            onClick={() => handleEdit(job)}
                          >
                            <BorderColorOutlinedIcon />
                          </IconButton>
                        </Tooltip>
         
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          color="error"
                          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
                          onClick={() => handleDelete(job)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={jobRolesData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Subordinates Component */}
      <Subordinates
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        jobCode={selectedJobCode}
        officialDesignation={selectedOfficialDesignation}
      />

      {/* Edit Job Role Dialog */}
      {editDialogOpen && (
        <EditJobRoleAndDescriptionDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          jobData={selectedJobRole}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        data={selectedOfficialDesignation}
      />
    </Paper>
  );
}

export default JobRolesTable;
