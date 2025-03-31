// useJobAssignments.jsx
import { useState, useEffect, useCallback } from "react";
import { AxiosInstance } from "../utils/axiosInstance";

const axios = AxiosInstance();

export const useJobAssignments = () => {
  const [employees, setEmployees] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [reportingManagers, setReportingManagers] = useState([]);
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

  // Fetch data from API
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
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: `Failed to fetch data: ${error.message}`,
      });
    } finally {
      setFetching(false);
    }
  };

  // Fetch employees
  const fetchEmployees = () => {
    fetchData("/employees/getEmployees.json", setEmployees, {
      page: page + 1,
      limit: rowsPerPage,
      search: searchQuery,
    });
  };

  // Fetch job roles
  const fetchJobRoles = () => {
    fetchData("/JobRolesAndDescription/getJobRolesForEmployees.json", setJobRoles);
  };

  // Fetch reporting managers using POST with FormData and Axios
  const fetchReportingManagers = useCallback(async (employee) => {
    try {
      const formData = new FormData();
      formData.append('exclude_employee_id', employee.employee_id || ''); // Handle undefined employeeId
      formData.append('job_role_code', employee.job_role_code || ''); // Handle undefined employeeId

      const response = await axios.post('/employees/get-employee-reporting-managers.json', formData);

      // Log response for debugging
      console.log('fetchReportingManagers response:', response.data);

      // Handle different response structures
      const data = response.data.is_success ? response.data.data : response.data;
      if (!Array.isArray(data)) {
        console.error('Expected an array, got:', data);
        throw new Error('Invalid response format: Expected an array of managers');
      }

      // Transform data to required format: { value, label }
      const formattedManagers = data.map(manager => ({
        value: manager.employee_id,
        label: `${manager.first_name} ${manager.last_name}`
      }));

      setReportingManagers(formattedManagers);
      return formattedManagers;
    } catch (error) {
      console.error('Error in fetchReportingManagers:', error);
      setSuccessErrorModal({
        open: true,
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to fetch reporting managers'
      });
      setReportingManagers([]); // Reset to empty array on error
      return []; // Return empty array to prevent downstream errors
    }
  }, []);

  // Save reporting manager assignment using POST with FormData and Axios
  const saveReportingManager = useCallback(async (data) => {
    setSaving(true);
    setProgressMessage('Saving reporting manager...');
    try {
      const formData = new FormData();
      formData.append('employeeId', data.employeeId);
      formData.append('reportingManagerId', data.reportingManagerId);

      const response = await axios.post('/employees/save-reporting-manager.json', formData); // Correct endpoint
        
      if (!response.data[0].is_success) {
        throw new Error(response.data.message || 'Failed to save reporting manager');
      }

      setSuccessErrorModal({
        open: true,
        type: 'success',
        message: 'Reporting manager assigned successfully'
      });

      fetchEmployees(); // Refresh employees list
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to save reporting manager'
      });
    } finally {
      setSaving(false);
      setProgressMessage('');
    }
  }, [fetchEmployees]);

  const savePerformance = useCallback(async (data) => {
    setSaving(true);
    setProgressMessage("Saving performance data...");
    try {
      const formData = new FormData();
      formData.append("employeeId", data.employeeId);
      formData.append("performanceRating", data.performanceRating);
      formData.append("appraisalDate", data.appraisalDate);
      formData.append("promotions", JSON.stringify(data.promotions));

      const response = await axios.post("/employees/save-performance.json", formData);
      if (!response.data.is_success) {
        throw new Error(response.data.message || "Failed to save performance data");
      }

      setSuccessErrorModal({
        open: true,
        type: "success",
        message: "Performance data saved successfully",
      });
      fetchEmployees(); // Refresh employee list if needed
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to save performance data",
      });
      throw error; // Re-throw to handle in Employees.jsx
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  }, [fetchEmployees]);

  const saveExit = useCallback(async (data) => {
    setSaving(true);
    setProgressMessage('Saving exit data...');
    try {
      const formData = new FormData();
      formData.append('employeeId', data.employeeId);
      formData.append('resignationDate', data.resignationDate);
      formData.append('lastWorkingDay', data.lastWorkingDay);
      formData.append('reasonForLeaving', data.reasonForLeaving);
      formData.append('exitInterviewNote', data.exitInterviewNote);
      formData.append('finalSettlementAmount', data.finalSettlementAmount);
      formData.append('exitClearanceStatus', data.exitClearanceStatus);
  
      const response = await axios.post('/employees/save-exit.json', formData);
      if (!response.data[0].is_success) {
        throw new Error(response.data.message || 'Failed to save exit data');
      }
  
      setSuccessErrorModal({
        open: true,
        type: 'success',
        message: 'Exit data saved successfully',
      });
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to save exit data',
      });
      throw error;
    } finally {
      setSaving(false);
      setProgressMessage('');
    }
  }, [fetchEmployees]);


  // Fetch job roles on mount (no employeeId needed here)
  useEffect(() => {
    fetchJobRoles();
    // Don't call fetchReportingManagers here since it needs an employeeId
  }, []);

  // Fetch employees when page, rowsPerPage, or searchQuery changes
  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, searchQuery]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query.trim());
    setPage(0);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setProgressMessage("Saving employee...");
    try {
      const requiredFields = [
        "firstName",
        "middleName",
        "lastName",
        "dateOfBirth",
        "sex",
        "civilStatus",
        "emailAddress",
        "contactNumber",
        "jobRoleCode",
        "employmentType",
        "dateOfHire",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const formDataToSend = new FormData();
      const serializedData = {
        ...formData,
        leaveTypes: JSON.stringify(formData.leaveTypes || []),
        emergencyContacts: JSON.stringify(formData.emergencyContacts || []),
      };

      Object.keys(serializedData).forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (serializedData[key] !== null && serializedData[key] !== undefined) {
          formDataToSend.append(key, serializedData[key]);
        }
      });
      

      const response = await axios.post("/employees/saveEmployee.json", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.is_success) {
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Employee saved successfully",
        });
        fetchEmployees();
      } else {
        throw new Error(response.data.message || "Failed to save employee");
      }
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "Failed to save employee",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    setProgressMessage("Updating employee...");
    try {
      if (!formData.employeeId) {
        throw new Error("Employee ID is required for update");
      }

      const formDataToSend = new FormData();
      const serializedData = {
        ...formData,
        leaveTypes: JSON.stringify(formData.leaveTypes || []),
        emergencyContacts: JSON.stringify(formData.emergencyContacts || []),
      };

      Object.keys(serializedData).forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (serializedData[key] !== null && serializedData[key] !== undefined) {
          formDataToSend.append(key, serializedData[key]);
        }
      });

      const response = await axios.post("/employees/updateEmployee.json", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.is_success) {
        fetchEmployees();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Employee updated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to update employee");
      }
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "Failed to update employee",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleDelete = async (employeeId) => {
    setSaving(true);
    setProgressMessage(`Deleting employee with ID: ${employeeId}...`);
    try {
      const response = await axios.post("/employees/deleteEmployee.json", {
        employeeId,
      });

      if (response.data.is_success) {
        fetchEmployees();
        setSuccessErrorModal({
          open: true,
          type: "success",
          message: "Employee deleted successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete employee");
      }
    } catch (error) {
      setSuccessErrorModal({
        open: true,
        type: "error",
        message: error.message || "Failed to delete employee",
      });
    } finally {
      setSaving(false);
      setProgressMessage("");
    }
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  return {
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
    handleEdit,
    fetchReportingManagers,
    saveReportingManager,
    savePerformance,
      saveExit,
  };
};

export default useJobAssignments;