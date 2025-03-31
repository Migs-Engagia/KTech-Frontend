import { useState, useEffect } from "react";
import { AxiosInstance } from "../utils/axiosInstance";

const axios = AxiosInstance();

export const useReportingRelationships = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [reportingTo, setReportingTo] = useState([]);
  const [jobRelationships, setJobRelationships] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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
        // Reset page to 0 if no data is available
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
    fetchData("/JobRolesAndDescription/getJobRolesAndRelationship.json", setJobRoles);
  }, []);

  useEffect(() => {
    fetchData("/JobRolesAndDescription/getJobRolesData.json", setReportingTo);
  }, []);

  const fetchRelationships = () => {
    fetchData("/JobReportingRelationship/getJobReportingRelationship.json", setJobRelationships, {
      page: page + 1, // 1-based indexing for API
      limit: rowsPerPage,
      search: searchQuery,
    });
  };

  useEffect(() => {
    fetchRelationships();
  }, [page, rowsPerPage, searchQuery]);

  const getDesignation = (code, roles) => {
    const role = roles.find((r) => r.code === code);
    return role ? role.official_designation : code;
  };

  const getJobRoleDesignation = (code) => getDesignation(code, jobRoles);
  const getReportToDesignation = (code) => getDesignation(code, reportingTo);

  const objectToFormData = (object) => {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  };

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
    setPage(0); // Reset to first page on new search
  };

  const handleSave = async () => {
    if (!role || !reportTo) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "Please select both Job Role and Reports To",
      });
      return;
    }

    if (role === reportTo) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "A job role cannot report to itself",
      });
      return;
    }

    setConfirmOpen(false);
    setSaving(true);
    setProgressMessage(`Saving: ${getJobRoleDesignation(role)} → ${getReportToDesignation(reportTo)}...`);

    try {
      const formData = objectToFormData({ job_role_code: role, report_to_code: reportTo });
      const response = await axios.post("/JobReportingRelationship/saveReportingRelationship.json", formData);

      if (response.data[0]?.is_success) {
        await fetchRelationships();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: response.data[0].message || "Reporting relationship saved successfully",
        });
        setRole("");
        setReportTo("");
      }
    } catch (error) {
      console.error("Error saving reporting relationship:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "Failed to save reporting relationship. Try again!",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleUpdate = async (data) => {
    if (data.job_role_code === data.report_to_code) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "A job role cannot report to itself",
      });
      return;
    }
    setSaving(true);
    setProgressMessage(
      `Updating: ${getJobRoleDesignation(data.job_role_code)} → ${getReportToDesignation(data.report_to_code)}...`
    );

    try {
      const formData = objectToFormData(data);
      const response = await axios.post("/JobReportingRelationship/editJobReportingRelationship.json", formData);

      if (response.data[0]?.is_success) {
        await fetchRelationships();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: response.data[0].message || "Reporting relationship updated successfully",
        });
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating reporting relationship:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "Failed to update reporting relationship",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleDelete = async (item) => {
    setSaving(true);
    setProgressMessage(
      `Deleting: ${getJobRoleDesignation(item.job_role)} → ${getReportToDesignation(item.report_to_code)}...`
    );
    try {
      const response = await axios.post("/JobReportingRelationship/deleteReportingRelationship.json", {
        job_code: item.job_code,
      });
      if (response.data.is_success) {
        await fetchRelationships();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Reporting relationship deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting reporting relationship:", error);
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: "Failed to delete reporting relationship",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  return {
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
    page,
    rowsPerPage,
    totalRows,
    setPage,
    setRowsPerPage,
    handleSearch,
  };
};