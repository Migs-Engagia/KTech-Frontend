import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Tabs,
  Tab,
  Box,
  IconButton,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import { AxiosInstance } from "../utils/axiosInstance";
import DescriptionIcon from "@mui/icons-material/Description"; // For non-image files


// Base URL for your CakePHP app
const BASE_URL = "http://localhost:94/webroot";

const axios = AxiosInstance();

const tabEndpoints = {
  0: 'getPersonalInformation.json',
  1: 'getEmploymentDetails.json',
  2: 'getPayroll.json',
  3: 'getStatutoryDeductions.json',
  4: 'getAttendanceLeave.json',
  5: 'getPerformance.json',
  6: 'getSecurityAccess.json',
  7: 'getEmergencyContact.json',
  8: 'getDocumentsAttachments.json',
  9: 'getExitInformation.json'
};

const menuItems = [
  "Personal Information",
  "Employment Details",
  "Payroll",
  "Statutory Deductions",
  "Attendance & Leave Information",
  "Performance Information",
  "Security & Access",
  "Emergency Contact",
  "Documents & Attachments",
  "Exit Information",
];

const useEmployeeData = () => {
  const [employeeTabData, setEmployeeTabData] = useState({});
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeTabData = useCallback(async (employeeId, tabIndex) => {
    setFetching(true);
    setError(null);
    
    try {
      const endpoint = `/employees/${tabEndpoints[tabIndex]}`;
      const formData = new FormData();
      formData.append('employee_id', employeeId);

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setEmployeeTabData(prev => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          [tabIndex]: response.data.data
        }
      }));
    } catch (err) {
      setError(err.message || `Failed to fetch ${menuItems[tabIndex]} data`);
      console.error('Fetch error:', err);
    } finally {
      setFetching(false);
    }
  }, []);

  return { employeeTabData, fetchEmployeeTabData, fetching, error };
};

const renderDetails = (data, tabIndex) => {
  if (!data) {
    return <Typography>No data available</Typography>;
  }

  if (tabIndex === 0) { // Personal Information
    const personalInfoFields = [
      { label: "EMPLOYEE ID", value: data.employee_id },
      { label: "SEX", value: data.sex },
      { label: "BIRTH DATE", value: data.birth_date },
      { label: "BIRTH PLACE", value: data.birth_place },
      { label: "CIVIL STATUS", value: data.civil_status },
      { label: "NATIONALITY", value: data.nationality },
      { label: "BLOOD TYPE", value: data.blood_type },
      { label: "EMAIL ADDRESS", value: data.email_address },
      { label: "CONTACT NUMBER", value: data.contact_number },
      { label: "STREET NUMBER", value: data.street_number },
      { label: "STREET NAME", value: data.street_name },
      { label: "BARANGAY", value: data.barangay },
      { label: "CITY/MUNICIPALITY", value: data.city_municipality },
      { label: "PROVINCE", value: data.province },
      { label: "ZIPCODE", value: data.zipcode },
    ];

    return (
      <Box>
        {personalInfoFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }

  if (tabIndex === 1) { // Employment Details
    const employmentDetailsFields = [
      { label: "JOB TITLE", value: data.job_role },
      { label: "DEPARTMENT", value: data.department },
      { label: "HIRE DATE", value: data.date_of_hire },
      { label: "EMPLOYMENT TYPE", value: data.employment_type },
      { label: "EMPLOYMENT STATUS", value: data.employee_status },
      { label: "REPORTING MANAGER", value: data.reporting_manager_name },
      { label: "START DATE", value: data.start_date },
      { label: "END DATE", value: data.end_date },
    ];

    return (
      <Box>
        {employmentDetailsFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }

  if (tabIndex === 2) { // Payroll Details
    const payrollDetailsFields = [
      { label: "MONTHLY SALARY", value: data.monthly_salary },
      { label: "PAY FREQUENCY", value: data.pay_frequency },
      { label: "PAYMENT MODE", value: data.payment_mode },
      { label: "BANK ACCOUNT NUMBER", value: data.bank_account_number },
      { label: "BANK NAME", value: data.bank_name },
      { label: "TAX STATUS", value: data.tax_status },
    ];

    return (
      <Box>
        {payrollDetailsFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }

  if (tabIndex === 3) { // Statutory Deductions
    const statutoryDeductionsFields = [
      { label: "SSS NUMBER", value: data.sss_number },
      { label: "SSS CONTRIBUTION", value: data.sss_contribution },
      { label: "PHILHEALTH NUMBER", value: data.philhealth_number },
      { label: "PHILHEALTH CONTRIBUTION", value: data.philhealth_contribution },
      { label: "PAGIBIG NUMBER", value: data.pagibig_number },
      { label: "PAGIBIG CONTRIBUTION", value: data.pagibig_contribution },
      { label: "TIN NUMBER", value: data.tin_number },
      { label: "INCOME TAX DEDUCTION", value: data.income_tax_deduction },
    ];

    return (
      <Box>
        {statutoryDeductionsFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }

  if (tabIndex === 4) { // Attendance & Leave Information
    // Assume work_hours is the same for all entries and take it from the first one
    const workHours = data.length > 0 ? data[0].work_hours : "N/A";

    return (
      <Box>
        <Grid container sx={{ py: 1 }}>
          <Grid item xs={5}>
            <Typography fontWeight="bold">WORK HOURS</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{workHours}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave Balances
        </Typography>
        {data.map((leave, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container sx={{ py: 1 }}>
              <Grid item xs={5}>
                <Typography fontWeight="bold">LEAVE TYPE</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>{leave.leave_type || "N/A"}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ py: 1 }}>
              <Grid item xs={5}>
                <Typography fontWeight="bold">BALANCE</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>{leave.balance || "N/A"}</Typography>
              </Grid>
            </Grid>
            {index < data.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>
    );
  }

  if (tabIndex === 5) { // Performance Information
    const { performance = [], promotions = [] } = data;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Performance Reviews
        </Typography>
        {performance.length > 0 ? (
          performance.map((perf, index) => (
            <Box key={perf.performance_id} sx={{ mb: 2 }}>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">APPRAISAL DATE</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{perf.appraisal_date || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">PERFORMANCE RATING</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{perf.performance_rating || "N/A"}</Typography>
                </Grid>
              </Grid>
              {index < performance.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        ) : (
          <Typography>No performance reviews available</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Promotion History
        </Typography>
        {promotions.length > 0 ? (
          promotions.map((promo, index) => (
            <Box key={promo.promotion_id} sx={{ mb: 2 }}>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">PROMOTION DATE</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{promo.promotion_date || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">NEW JOB ROLE ID</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{promo.new_job_role_id || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">SALARY INCREASE</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{promo.salary_increase || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">REASON</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{promo.reason || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">PROMOTING MANAGER ID</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{promo.promoting_manager_id || "N/A"}</Typography>
                </Grid>
              </Grid>
              {index < promotions.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        ) : (
          <Typography>No promotions available</Typography>
        )}
      </Box>
    );
  }

  if (tabIndex === 6) { // Security & Access
    const securityAccessFields = [
      { label: "ROLE", value: data.system_user_role },
      { label: "USERNAME", value: data.username },
      { label: "SYSTEM ENABLED ACCESS", value: data.system_access_enabled ? "Yes" : "No" },
    ];
  
    return (
      <Box>
        {securityAccessFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value ?? "N/A"} {/* Use nullish coalescing to handle null/undefined */}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }

  if (tabIndex === 7) { // Emergency Contacts
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Emergency Contacts
        </Typography>
        <Divider/>
        {data.length > 0 ? (
          data.map((contact, index) => (
            <Box key={index} sx={{ mb: 2, mt: 1 }}>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">CONTACT NAME</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{contact.contact_name || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">RELATIONSHIP</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{contact.relationship || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">CONTACT NUMBER</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{contact.contact_number || "N/A"}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">ADDRESS</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>{contact.address || "N/A"}</Typography>
                </Grid>
              </Grid>
              {index < data.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        ) : (
          <Typography>No emergency contacts available</Typography>
        )}
      </Box>
    );
  }

  if (tabIndex === 8) { // Documents & Attachments
    const getFileUrl = (filePath) => `${BASE_URL}/${filePath}`;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Documents & Attachments
        </Typography>
        {data.length > 0 ? (
          data.map((doc, index) => (
            <Box key={doc.id} sx={{ mb: 2 }}>
              <Grid container sx={{ py: 1, alignItems: "center" }}>
                <Grid item xs={5}>
                  <Typography fontWeight="bold">
                    {doc.attachment_type.toUpperCase().replace("_", " ")}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <a
                    href={getFileUrl(doc.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={doc.file_name}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {doc.attachment_type === "employee_image" ? (
                      <img
                        src={getFileUrl(doc.file_path)}
                        alt={doc.file_name}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onError={(e) => (e.target.src = "/path/to/fallback-image.jpg")} // Optional fallback
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <DescriptionIcon sx={{ mr: 1 }} />
                        <Typography>{doc.file_name}</Typography>
                      </Box>
                    )}
                  </a>
                </Grid>
              </Grid>
              {index < data.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        ) : (
          <Typography>No documents or attachments available</Typography>
        )}
      </Box>
    );
  }

  if (tabIndex === 9) { // Exit Information
    const exitInfoFields = [
      { label: "RESIGNATION DATE", value: data[0].resignation_date },
      { label: "LAST WORKING DAY", value: data[0].last_working_day },
      { label: "REASON FOR LEAVING", value: data[0].reason_for_leaving },
      { label: "EXIT INTERVIEW NOTE", value: data[0].exit_interview_note },
      {
        label: "FINAL SETTLEMENT AMOUNT",
        value: data[0].final_settlement_amount
          ? parseFloat(data[0].final_settlement_amount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : null,
      },
      { label: "EXIT CLEARANCE STATUS", value: data[0].exit_clearance_status },
    ];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Exit Information
        </Typography>
        {exitInfoFields.map(({ label, value }) => (
          <Grid container key={label} sx={{ py: 1 }}>
            <Grid item xs={5}>
              <Typography fontWeight="bold">
                {label}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                {value ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }
  

  // Fallback for other tabs
  return (
    <Box>
      {Object.entries(data).map(([key, value]) => (
        <Grid container key={key} sx={{ py: 1 }}>
          <Grid item xs={5}>
            <Typography fontWeight="bold" sx={{ textTransform: "capitalize" }}>
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>
              {Array.isArray(value) ? value.join(", ") : value || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const { employeeTabData, fetchEmployeeTabData, fetching, error } = useEmployeeData();
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchInitialData = useCallback(() => {
    fetchEmployeeTabData(employeeId, 0); // Personal Information
  }, [employeeId, fetchEmployeeTabData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    fetchEmployeeTabData(employeeId, newValue);
  };

  const renderTabContent = () => {
    const data = employeeTabData[employeeId]?.[selectedTab];
    
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }
    
    if (fetching) {
      return <Typography>Loading {menuItems[selectedTab]}...</Typography>;
    }
    
    if (!data) {
      return <Typography>No {menuItems[selectedTab]} data available</Typography>;
    }

    if (selectedTab === 0) {
      const fullName = `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim();
      const relativeImagePath = data.profile_picture_path;
      const imageUrl = relativeImagePath ? `${BASE_URL}/${relativeImagePath}` : null;

      return (
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              {fetching && !imageUrl ? (
                <CircularProgress />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={fullName || "Employee"}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No profile picture available
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {fullName || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          {renderDetails(data, selectedTab)}
        </>
      );
    }

    return renderDetails(data, selectedTab);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {fetching && (
        <LinearProgress sx={{ position: "absolute", top: 64, left: 0, width: "100%" }} />
      )}
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            mb: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Employee Details
          </Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: 1 }}>
        <Box width={250} p={2} sx={{ backgroundColor: "#f9f9f9", minHeight: "100%" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{ borderRight: 0 }}
          >
            {menuItems.map((item, index) => (
              <Tab
                key={index}
                label={item}
                sx={{
                  '&:focus': { outline: 'none' },
                  '&.Mui-focusVisible': { outline: 'none' },
                  '&.Mui-selected': {
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9C27B0',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box flex={1} p={1}>
          <Card sx={{ maxWidth: 700, margin: "auto" }}>
            <CardContent>{renderTabContent()}</CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeDetails;