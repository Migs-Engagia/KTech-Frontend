import React, { useState, useEffect } from "react"; // Add useEffect
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
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import ProgressModal from "./ProgressModal";
import ConfirmationModal from "./ConfirmationModal";
import SuccessErrorModal from "./SuccessErrorModal";
import OrgtrakkerTable from "./OrgtrakkerTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useRoutines } from "../hooks/useRoutines";
import RoutineDialog from "./RoutineDialog";
import ViewAssignedRolesDialog from "./ViewAssignedRolesDialog"; // New dialog component
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

// Table Component
const tableHeaders = [
  "Routine Code",
  "Routine",
  "Estimated Time (hrs)",
  "Action",
];

const renderTableRow = (item, index, onDelete, onEdit, onView, disabled) => (
  <>
    <TableCell>{item.routine_code || "N/A"}</TableCell>
    <TableCell>{item.job_routine || "N/A"}</TableCell>
    <TableCell>{item.estimated_time || "N/A"}</TableCell>
    <TableCell>
      <IconButton
        color="primary"
        onClick={() => onView(item)}
        disabled={
          disabled || !item.assigned_roles || item.assigned_roles.length === 0
        }
        sx={{ p: 0.5, "&:focus": { outline: "none" } }}
      >
        <Visibility />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={() => onEdit(item)}
        disabled={disabled}
        sx={{ p: 0.5, "&:focus": { outline: "none" } }}
      >
        <BorderColorOutlinedIcon />
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
  <Box sx={{ display: "flex", justifyContent: "LEFT", mb: 3 }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={onSaveClick}
      // disabled={saving || fetching}
      sx={{
        "&:focus": { outline: "none" },
        "&:hover": { backgroundColor: "#8FD357" },
        width: "180px",
        height: "45px",
      }}
    >
      ADD ROUTINE
    </Button>
  </Box>
);

function Routines() {
  const {
    jobRoles,
    jobRoutines,
    fetching,
    saving,
    confirmOpen,
    setConfirmOpen,
    successErrorModal,
    setSuccessErrorModal,
    progressMessage,
    getJobRoleDesignation,
    handleSave,
    handleUpdate,
    handleDelete,
    totalRows,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleSearch,
  } = useRoutines();

  const [searchInput, setSearchInput] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEditingItem, setDialogEditingItem] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null); // Store data until confirmed
  const [viewDialogOpen, setViewDialogOpen] = useState(false); // New state for view dialog
  const [selectedRoutine, setSelectedRoutine] = useState(null); // New state for selected routine
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

  const openDialogForCreate = () => {
    setDialogEditingItem(null);
    setDialogOpen(true);
  };

  const openDialogForEdit = (item) => {
    console.log(item);
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
        handleUpdate({ ...editingItem, ...formData });
      } else {
        handleSave(formData);
        // Reset form only when creating a new routine
        setDialogEditingItem(null); // Reset editingItem to trigger form reset in RoutineDialog
      }
      setPendingSaveData(null);
      setConfirmOpen(false);
      closeDialog();
    }
  };

  const openViewDialog = (item) => {
    setSelectedRoutine(item);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedRoutine(null);
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
        ROUTINES AND WORKLOADS
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
              label="Search Job Roles"
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
        data={jobRoutines}
        renderRow={renderTableRow} // Pass the function directly
        onDelete={openDeleteDialog}
        onEdit={openDialogForEdit}
        onView={openViewDialog}
        disabled={saving || fetching}
        loading={fetching} // Pass fetching as loading prop
        loadingMessage="Loading job routines..." // Context-specific message
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
        message={`Are you sure you want to save the job routine "${
          pendingSaveData?.formData.routineCode || ""
        } - ${pendingSaveData?.formData.routine || ""}"?`}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        data={itemToDelete ? `routine code - ${itemToDelete.routine_code}` : ""}
      />
      <SuccessErrorModal
        open={successErrorModal.open}
        onClose={() =>
          setSuccessErrorModal({ ...successErrorModal, open: false })
        }
        type={successErrorModal.type}
        message={successErrorModal.message}
      />

      <RoutineDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={handleDialogSave}
        roles={jobRoles || []}
        editingItem={dialogEditingItem}
      />

      <ViewAssignedRolesDialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        routine={selectedRoutine}
      />
    </Box>
  );
}

export default Routines;
