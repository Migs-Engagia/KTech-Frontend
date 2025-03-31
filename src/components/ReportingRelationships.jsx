import React, { useState, useEffect } from "react"; // Add useEffect
import {
  Typography,
  Button,
  TableCell,
  IconButton,
  Box,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import ProgressModal from "./ProgressModal";
import ConfirmationModal from "./ConfirmationModal";
import SuccessErrorModal from "./SuccessErrorModal";
import OrgtrakkerTable from "./OrgtrakkerTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useReportingRelationships } from "../hooks/useReportingRelationships";

// Reusable Role Select Component
const RoleSelect = ({ label, value, onChange, options, disabled }) => {
  const displayValue = options.some((option) => option.code === value) ? value : "";

  return (
    <TextField
      select
      label={label}
      value={displayValue}
      onChange={onChange}
      fullWidth
      margin="normal"
      disabled={disabled || options.length === 0}
    >
      {options.length === 0 ? (
        <MenuItem value="" disabled>
          Loading options...
        </MenuItem>
      ) : (
        options.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.official_designation}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};

// Form Section Component
const FormSection = ({ jobRoles, reportingTo, role, reportTo, setRole, setReportTo, fetching }) => (
  <>
    <RoleSelect
      label="Job Role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      options={jobRoles}
      disabled={fetching}
    />
    <RoleSelect
      label="Reports To"
      value={reportTo}
      onChange={(e) => setReportTo(e.target.value)}
      options={reportingTo}
      disabled={fetching}
    />
  </>
);

// Edit Dialog Component
const EditDialog = ({ open, onClose, jobRoles, reportingTo, editingItem, onSave, saving }) => {
  const [editRole, setEditRole] = React.useState("");
  const [editReportTo, setEditReportTo] = React.useState("");
  const { getJobRoleDesignation } = useReportingRelationships();

  React.useEffect(() => {
    if (editingItem) {
      setEditRole(editingItem.job_code || "");
      setEditReportTo(
        reportingTo.some((r) => r.code === editingItem.report_to_code) ? editingItem.report_to_code : ""
      );
    }
  }, [editingItem, reportingTo]);

  const handleSave = () => {
    onSave({
      job_role_code: editRole,
      report_to_code: editReportTo,
    });
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: "white", p: 2 }}>
        Edit Reporting Relationship
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            label="Job Role"
            value={editingItem ? editingItem.job_role : ""}
            fullWidth
            margin="normal"
            disabled={true}
            InputProps={{ readOnly: true }}
          />
          <RoleSelect
            label="Reports To"
            value={editReportTo}
            onChange={(e) => setEditReportTo(e.target.value)}
            options={reportingTo}
            disabled={saving}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{ outline: "none", boxShadow: "none", "&:focus, &:active": { outline: "none", boxShadow: "none" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          sx={{ outline: "none", boxShadow: "none", "&:focus, &:active": { outline: "none", boxShadow: "none" } }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Table Component
const tableHeaders = ["Job Role", "Reports To", "Actions"];
const renderTableRow = (item, index, onDelete, onEdit, disabled) => (
  <>
    <TableCell>{item.job_role}</TableCell>
    <TableCell>{item.report_to_name}</TableCell>
    <TableCell>
      <IconButton
        color="primary"
        onClick={() => onEdit(item)}
        disabled={disabled}
        sx={{ p: 0.5, "&:focus": { outline: "none" } }}
      >
        <Edit />
      </IconButton>
      <IconButton
        color="error"
        onClick={() => onDelete(item)}
        disabled={disabled}
        sx={{ p: 0.5, "&:focus": { outline: "none" } }}
      >
        <Delete />
      </IconButton>
    </TableCell>
  </>
);

// Action Buttons Component
const ActionButtons = ({ onSaveClick, saving, fetching }) => (
  <Box sx={{ display: "flex", justifyContent: "right", mb: 3 }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={onSaveClick}
      disabled={saving || fetching}
      sx={{
        "&:focus": { outline: "none" },
        "&:hover": { backgroundColor: "#8FD357" },
        width: "120px",
        height: "45px",
      }}
    >
      SAVE
    </Button>
  </Box>
);

function ReportingRelationships() {
  const {
    jobRoles,
    reportingTo,
    jobRelationships,
    fetching,
    saving,
    role,
    setRole,
    reportTo,
    setReportTo,
    confirmOpen,
    setConfirmOpen,
    editDialogOpen,
    setEditDialogOpen,
    editingItem,
    successErrorModal,
    setSuccessErrorModal,
    progressMessage,
    getJobRoleDesignation,
    getReportToDesignation,
    handleSave,
    handleUpdate,
    handleDelete,
    handleEdit,
    totalRows,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleSearch,
  } = useReportingRelationships();

  const [searchInput, setSearchInput] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // New state

  // Track when fetching completes
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

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
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

  return (
    <Box sx={{ maxWidth: 1024, margin: "auto", padding: 1 }}>
      {fetching && <LinearProgress sx={{ position: "absolute", top: 64, left: 0, width: "100%" }} />}
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, textAlign: "left", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
        gutterBottom
      >
        REPORTING RELATIONSHIP
      </Typography>

      <FormSection
        jobRoles={jobRoles}
        reportingTo={reportingTo}
        role={role}
        reportTo={reportTo}
        setRole={setRole}
        setReportTo={setReportTo}
        fetching={fetching}
      />

      <ActionButtons onSaveClick={() => setConfirmOpen(true)} saving={saving} fetching={fetching} />

      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}> */}
      <Paper elevation={1} sx={{ padding: 2, borderRadius: 0, display: "flex", justifyContent: "flex-end" }}>
        <Autocomplete
          freeSolo
          options={[]}
          inputValue={searchInput}
          onInputChange={handleSearchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Job Roles"
              variant="outlined"
              size="small"
              sx={{ width: 300, '& .MuiInputLabel-root': { display: 'none' },  // Hide label
            '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' }  }}
              onKeyPress={handleSearchKeyPress}
            />
          )}
          loading={fetching}
          disabled={saving}
        />
         </Paper>
      {/* </Box> */}

      <OrgtrakkerTable
        headers={tableHeaders}
        data={jobRelationships}
        renderRow={renderTableRow}
        onDelete={openDeleteDialog}
        onEdit={handleEdit}
        disabled={saving || fetching}
        loading={fetching} // Pass fetching as loading prop
        loadingMessage="Loading reporting relationships..." // Context-specific message
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
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSave}
        title="Confirm Submission"
        message={`Are you sure you want to save the reporting relationship: '${getJobRoleDesignation(role)}' reporting to '${getReportToDesignation(reportTo)}'?`}
      />
      <EditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        jobRoles={jobRoles}
        reportingTo={reportingTo}
        editingItem={editingItem}
        onSave={handleUpdate}
        saving={saving}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        data={`${getJobRoleDesignation(itemToDelete?.job_role || "")} → ${getReportToDesignation(itemToDelete?.report_to_code || "")}`}
      />
      <SuccessErrorModal
        open={successErrorModal.open}
        onClose={() => setSuccessErrorModal({ ...successErrorModal, open: false })}
        type={successErrorModal.type}
        message={successErrorModal.message}
      />
    </Box>
  );
}

export default ReportingRelationships;