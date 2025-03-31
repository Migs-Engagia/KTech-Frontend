import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TableCell,
  IconButton,
  Box,
  LinearProgress,
  TextField,
  Autocomplete,
  Paper,
  Tooltip,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import ProgressModal from "./ProgressModal";
import ConfirmationModal from "./ConfirmationModal";
import SuccessErrorModal from "./SuccessErrorModal";
import OrgtrakkerTable from "./OrgtrakkerTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useJobAssignments } from "../hooks/useJobAssignments";
import EmployeeDialog from "./EmployeeDialog";
import ReportingManagerDialog from "./ReportingManagerDialog";
import PerformanceDialog from "./PerformanceDialog";
import ExitDialog from "./ExitDialog";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

// Table Headers for Employees
const tableHeaders = [
  "Employee ID",
  "First Name",
  "Last Name",
  "Job Role",
  "Employment Type",
  "Reporting Manager",
  "Action",
];

const handleView = (employeeId) => {
  if (!employeeId) {
    console.error("No employee ID provided");
    return;
  }
  window.open(`/employee-details/${employeeId}`, "_blank");
};

// Render table row for employee data
const renderTableRow = (
  item,
  index,
  onDelete,
  onEdit,
  onAddReportingManager,
  onAddPerformance,
  onExit,
  disabled
) => (
  <>
    <TableCell>{item.employee_id || "N/A"}</TableCell>
    <TableCell>{item.first_name || "N/A"}</TableCell>
    <TableCell>{item.last_name || "N/A"}</TableCell>
    <TableCell>{item.job_role || "N/A"}</TableCell>
    <TableCell>{item.employment_type || "N/A"}</TableCell>
    <TableCell>
      {item.reporting_manager_first_name && item.reporting_manager_last_name
        ? `${item.reporting_manager_first_name} ${item.reporting_manager_last_name}`
        : "N/A"}
    </TableCell>
    <TableCell>
      <Tooltip title="View Employee Details" arrow>
        <IconButton
          color="primary"
          onClick={() => handleView(item.employee_id)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <Visibility />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Reporting Manager" arrow>
        <IconButton
          color="secondary"
          onClick={() => onAddReportingManager(item)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <AssignmentIndOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Performance and Promotion" arrow>
        <IconButton
          color="warning"
          onClick={() => onAddPerformance(item.employee_id)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <WorkspacePremiumOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit Employee" arrow>
        <IconButton
          color="secondary"
          onClick={() => onEdit(item.employee_id)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <BorderColorOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Employee Exit" arrow>
        <IconButton
          color="#27B09C"
          onClick={() => onExit(item.employee_id)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <PersonRemoveAlt1OutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Employee" arrow>
        <IconButton
          color="error"
          onClick={() => onDelete(item.employee_id)}
          disabled={disabled}
          sx={{ p: 0.5, "&:focus": { outline: "none" } }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </TableCell>
  </>
);

// Action Buttons Component
const ActionButtons = ({ onSaveClick, saving, fetching }) => (
  <Box sx={{ display: "flex", justifyContent: "left", mb: 3 }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={onSaveClick}
      disabled={saving}
      sx={{
        "&:focus": { outline: "none" },
        "&:hover": { backgroundColor: "#8FD357" },
        width: "180px",
        height: "45px",
      }}
    >
      ADD EMPLOYEE
    </Button>
  </Box>
);

function Employees() {
  const {
    employees,
    jobRoles,
    reportingManagers,
    fetching,
    saving,
    confirmOpen,
    setConfirmOpen,
    successErrorModal,
    setSuccessErrorModal,
    progressMessage,
    page,
    rowsPerPage,
    totalRows,
    setPage,
    setRowsPerPage,
    handleSearch,
    handleSave,
    handleUpdate,
    handleDelete,
    fetchReportingManagers,
    saveReportingManager,
    savePerformance, // Ensure this is exported
    saveExit,
  } = useJobAssignments();

  const [searchInput, setSearchInput] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEditingItem, setDialogEditingItem] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [reportingManagerOpen, setReportingManagerOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Changed from [] to null

  useEffect(() => {
    if (!fetching) {
      setHasFetched(true);
    }
  }, [fetching]);

  const handleSearchChange = (event, newInputValue) => {
    setSearchInput(newInputValue);
    handleSearch(newInputValue);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(searchInput);
    }
  };

  const openDeleteDialog = (employeeId) => {
    setItemToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
      closeDeleteDialog();
    }
  };

  const openDialogForCreate = () => {
    setDialogEditingItem(null);
    setDialogOpen(true);
  };

  const openDialogForEdit = (employeeId) => {
    const item = employees.find((emp) => emp.employee_id === employeeId);
    setDialogEditingItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogEditingItem(null);
  };

  const handleDialogSave = (formData, editingItem) => {
    setPendingSaveData({ formData, editingItem });
    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingSaveData) {
      const { formData, editingItem } = pendingSaveData;
      if (editingItem) {
        handleUpdate({ ...formData, employeeId: editingItem.employee_id });
      } else {
        handleSave(formData);
      }
      setPendingSaveData(null);
      setConfirmOpen(false);
      closeDialog();
    }
  };

  const handleAddReportingManager = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
    setReportingManagerOpen(true);
  };

  const handleAddPerformance = (employeeId) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employeeId);
    setPerformanceOpen(true);
  };

  const handleSavePerformance = async (performanceData) => {
    try {
      await savePerformance(performanceData); // Call savePerformance from useJobAssignments
      setPerformanceOpen(false); // Close dialog on success
    } catch (error) {
      console.error('Failed to save performance data:', error);
      // Optionally keep dialog open or show error in UI
    }
  };

  const handleExit = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setExitOpen(true);
  };

  const handleSaveExit = async (exitData) => {
    try {
      await saveExit(exitData); // Assuming saveExit is added to useJobAssignments
      setExitOpen(false);
    } catch (error) {
      console.error('Failed to save exit data:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1024, margin: "auto", padding: 1 }}>
      {fetching && (
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
        gutterBottom
      >
        EMPLOYEES
      </Typography>

      <ActionButtons
        onSaveClick={openDialogForCreate}
        saving={saving}
        fetching={fetching}
      />

      <Paper
        elevation={1}
        sx={{
          padding: 2,
          borderRadius: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Autocomplete
          freeSolo
          options={[]}
          inputValue={searchInput}
          onInputChange={handleSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employees"
              variant="outlined"
              size="small"
              sx={{
                width: 300,
                "& .MuiInputLabel-root": { display: "none" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  display: "none",
                },
              }}
              onKeyPress={handleSearchKeyPress}
            />
          )}
          loading={fetching}
          disabled={saving}
        />
      </Paper>

      <OrgtrakkerTable
        headers={tableHeaders}
        data={employees}
        renderRow={(item, index) =>
          renderTableRow(
            item,
            index,
            openDeleteDialog,
            openDialogForEdit,
            handleAddReportingManager,
            handleAddPerformance,
            handleExit,
            saving || fetching
          )
        }
        disabled={saving || fetching}
        loading={fetching}
        loadingMessage="Loading employees..."
        pagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
      />

      <ProgressModal open={saving} message={progressMessage} />
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingSaveData(null);
        }}
        onConfirm={handleConfirmSave}
        title="Confirm Submission"
        message={`Are you sure you want to save the employee "${
          pendingSaveData?.formData.firstName || ""
        } ${pendingSaveData?.formData.lastName || ""}"?`}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        data={itemToDelete ? `Employee ID - ${itemToDelete}` : ""}
      />
      <SuccessErrorModal
        open={successErrorModal.open}
        onClose={() =>
          setSuccessErrorModal({ ...successErrorModal, open: false })
        }
        type={successErrorModal.type}
        message={successErrorModal.message}
      />

      <EmployeeDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={handleDialogSave}
        jobRoles={jobRoles || []}
        editingItem={dialogEditingItem}
      />

      <ReportingManagerDialog
        open={reportingManagerOpen}
        onClose={() => setReportingManagerOpen(false)}
        employee={selectedEmployee}
        fetchReportingManagers={fetchReportingManagers}
        saveReportingManager={saveReportingManager}
        saving={saving}
      />

      <PerformanceDialog
        open={performanceOpen}
        onClose={() => setPerformanceOpen(false)}
        employeeId={selectedEmployeeId}
        employee={selectedEmployee}
        jobRoles={jobRoles}
        reportingManagers={reportingManagers}
        fetchReportingManagers={fetchReportingManagers}
        onSave={handleSavePerformance}
      />

      <ExitDialog
      open={exitOpen}
      onClose={() => setExitOpen(false)}
      employeeId={selectedEmployeeId}
      onSave={handleSaveExit}
    />
    </Box>
  );
}

export default Employees;
