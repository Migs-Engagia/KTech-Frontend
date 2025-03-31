import { useState, useEffect } from "react";
import { AxiosInstance } from "../utils/axiosInstance";

const axios = AxiosInstance();

export const useRoutines = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [jobRoutines, setJobRoutines] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successErrorModal, setSuccessErrorModal] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [progressMessage, setProgressMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (url, setter, payload = {}) => {
    try {
      setFetching(true);
      const response = await axios.post(url, payload);
      if (response.data.is_success) {
        setter(response.data.data);
        const newTotal = response.data.total || 0;
        setTotalRows(newTotal);
        if (newTotal === 0 && page !== 0) {
          setPage(0);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData("/JobRolesAndDescription/getJobRolesForRoutines.json", setJobRoles);
  }, []);

  const fetchRoutines = () => {
    fetchData("/JobRoutines/getJobRoutines.json", setJobRoutines, {
      page: page + 1,
      limit: rowsPerPage,
      search: searchQuery,
    });
  };

  useEffect(() => {
    fetchRoutines();
  }, [page, rowsPerPage, searchQuery]);

  const getDesignation = (code, roles) => {
    const role = roles.find((r) => r.code === code);
    return role ? role.official_designation : code;
  };

  const getJobRoleDesignation = (code) => getDesignation(code, jobRoles);

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
    setPage(0);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setProgressMessage("Saving routine...");
    try {
      if (
        !formData.routineCode ||
        !formData.routine ||
        !formData.estimatedTime ||
        formData.assignedRole.length === 0
      ) {
        throw new Error("All fields are required, including at least one role");
      }
      if (!/^\d*\.?\d*$/.test(formData.estimatedTime)) {
        throw new Error("Estimated time must be a valid number");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("routineCode", formData.routineCode);
      formDataToSend.append("routine", formData.routine);
      formDataToSend.append("estimatedTime", formData.estimatedTime);
      formData.assignedRole.forEach((roleCode, index) => {
        formDataToSend.append(`assignedRole[${index}]`, roleCode);
      });

      const response = await axios.post("/JobRoutines/saveJobRoutines.json", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data[0]?.is_success) {
        const newRoutine = response.data[0].data || {
          routineCode: formData.routineCode,
          routine: formData.routine,
          estimatedTime: formData.estimatedTime,
          assignedRole: formData.assignedRole,
        };
        setJobRoutines((prev) => [...prev, newRoutine]);
        setTotalRows((prev) => prev + 1);
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Routine saved successfully",
        });
        fetchRoutines();
      } else {
        throw new Error(response.data[0]?.message || "Failed to save routine");
      }
    } catch (error) {
      console.error("Error saving routine:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "Failed to save routine",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    setProgressMessage("Updating routine...");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("routineCode", formData.routineCode);
      formDataToSend.append("routine", formData.routine);
      formDataToSend.append("estimatedTime", formData.estimatedTime);
      formData.assignedRole.forEach((roleCode, index) => {
        formDataToSend.append(`assignedRole[${index}]`, roleCode);
      });

      const response = await axios.post("/JobRoutines/updateJobRoutines.json", formDataToSend);
      if (response.data.is_success) {
        fetchRoutines();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Routine updated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to update routine");
      }
    } catch (error) {
      console.error("Error updating routine:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "Failed to update routine",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleDelete = async (item) => {
    setSaving(true);
    setProgressMessage(`Deleting routine: ${item.routine_code}...`);
    try {
      const response = await axios.post("/JobRoutines/deleteJobRoutine.json", {
        routineCode: item.routine_code,
      });

      // Handle both single object and array response
      const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
      if (responseData.is_success) {
        // Optimistically remove the item from the local state
        setJobRoutines((prev) =>
          prev.filter((routine) => routine.routineCode !== item.routineCode)
        );
        setTotalRows((prev) => prev - 1);
        // Fetch updated data to ensure consistency
        fetchRoutines();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Routine deleted successfully",
        });
      } else {
        throw new Error(responseData.message || "Failed to delete routine");
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "An error occurred while deleting the routine",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleEdit = (item) => {};

  return {
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
    handleEdit,
    page,
    rowsPerPage,
    totalRows,
    setPage,
    setRowsPerPage,
    handleSearch,
  };
};

export default useRoutines;