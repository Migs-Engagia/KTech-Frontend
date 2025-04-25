import { useState, useEffect, useMemo } from "react";
import { Box, useTheme, Tooltip, Fab } from "@mui/material";

import axios from "../../utils/axiosInstance";

import HeaderActions from "./DashboardComponents/HeaderActions";
import DashboardTable from "./DashboardComponents/DashboardTable";
import DashboardModals from "./DashboardComponents/DashboardModals";
import FilterDialog from "./DashboardComponents/DataTableUtilities/FilterDialog";

import ProgressModal from "./../ProgressModal";
import SuccessErrorModal from "./../SuccessErrorModal";
import UploadToKtechRaisers from "./../UploadToKtechRaisers";

import UploadIcon from "@mui/icons-material/CloudUpload";

import { useNavigate } from "react-router-dom";
const Dashboard = ({ user }) => {
  const theme = useTheme();

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState("");
  const [activeRow, setActiveRow] = useState(null);

  const [data, setData] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(true);

  const [progressLoading, setProgressLoading] = useState(false);
  const [uploadFormRecords, setUploadFormRecords] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showResultModal = (type, message) => {
    setResultModal({
      open: true,
      type,
      message,
    });
  };

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    cities: [],
    municipalities: [],
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    province: "All",
    city: "All",
    qualityRaiser: "All",
    visited: "All",
  });

  const headers = {
    "Hogs/AH": [
      "Raiser Name",
      "Province",
      "City",
      "Barangay",
      "Contact No.",
      "Boars",
      "Sow",
      "Gilts",
      "Fatteners",
      "Total",
      "Piglet",
      "Existing Feed",
      "KTech Name",
      "LK Date Created",
      "Quality Raiser Y/N",
      "Action",
    ],
    "SGF/PET": [
      "Raiser Name",
      "Province",
      "City",
      "Barangay",
      "Contact No.",
      "Corded",
      "Broodhen",
      "Stag",
      "Broodcock",
      "Total",
      "Chicks",
      "Existing Feed",
      "KTech Name",
      "LK Date Created",
      "Quality Raiser Y/N",
      "Action",
    ],
  };

  const selectedHeaders = useMemo(
    () => headers[user.product_line],
    [user.product_line]
  );

  useEffect(() => {
    if (uploadFormRecords === null) {
      const upload_form_records = localStorage.getItem("upload_form_records");
      setUploadFormRecords(upload_form_records);
    }

    if (
      (uploadFormRecords === "false" || uploadFormRecords === false) &&
      searchQuery.length !== ""
    ) {
      fetchRecruitmentData();
    }
  }, [
    pagination.page,
    pagination.limit,
    uploadFormRecords,
    searchQuery,
    filters,
    sortModel,
  ]);

  const fetchRecruitmentData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/dashboard/fetchRecruitmentLists.json",
        {
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery.trim(),
          filters: filters,
          sort: sortModel[0] || {},
        }
      );

      const { data } = response.data;

      setData(data);
      setPagination((prev) => ({
        ...prev,
        total: response?.data?.pagination?.total || 0,
      }));
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      }
      console.error("Error fetching recruitment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  const handleActionClick = (type, row) => {
    setActiveRow(row);
    setOpenModal(type);
  };

  const handleCloseModal = () => {
    setOpenModal("");
    setActiveRow(null);
  };

  const handleSaveHandlers = {
    date: async (data, row) => {
      try {
        const payload = { data };
        setProgressLoading(true);

        const response = await axios.post(
          "/dashboard/saveDateVisited.json",
          payload
        );
        if (response.data?.success) {
          showResultModal("success", response.data.message);
          fetchRecruitmentData();
        } else {
          showResultModal(
            "error",
            response.data?.message || "Failed to save Date of Visit."
          );
        }
      } catch (err) {
        showResultModal(
          "error",
          "Something went wrong while saving Date of Visit."
        );
      } finally {
        setProgressLoading(false);
      }
    },

    recruit: async (data, row) => {
      try {
        const payload = { data };
        setProgressLoading(true);

        const response = await axios.post(
          "/dashboard/saveRecruitmentStatus.json",
          payload
        );

        if (response.data?.success) {
          showResultModal("success", response.data.message);
          fetchRecruitmentData();
        } else {
          showResultModal(
            "error",
            response.data?.message || "Failed to save recruitment."
          );
        }
      } catch (err) {
        showResultModal("error", err.response.data.message);
      } finally {
        setProgressLoading(false);
      }
    },

    bags: async (data, row) => {
      try {
        const payload = {
          id: row.id,
          bags_per_month: data.bagsPerMonth,
        };

        setProgressLoading(true);

        const response = await axios.post(
          "/dashboard/saveMonthlyBags.json",
          payload
        );

        if (response.data?.success) {
          showResultModal("success", response.data.message || "Bags saved.");
          fetchRecruitmentData();
        } else {
          showResultModal(
            "error",
            response.data?.message || "Failed to save bags purchased."
          );
        }
      } catch (err) {
        showResultModal(
          "error",
          err?.response?.data?.message ||
            "Something went wrong while saving bags."
        );
      } finally {
        setProgressLoading(false);
      }
    },
  };

  const handleMarkAsUploaded = async () => {
    setUploadFormRecords("true");
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <HeaderActions
        onFilterClick={() => setFilterModalOpen(true)}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        searchQuery={searchQuery}
        filters={filters}
        loading={loading}
        sortModel={sortModel}
      />

      <DashboardTable
        data={data}
        user={user}
        onAction={handleActionClick}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        sortModel={sortModel}
        setSortModel={handleSortModelChange}
      />

      <DashboardModals
        openModal={openModal}
        row={activeRow}
        onClose={handleCloseModal}
        onSaveHandlers={handleSaveHandlers}
      />

      <FilterDialog
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={() => setFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />

      <ProgressModal open={progressLoading} message="Saving Record..." />

      <SuccessErrorModal
        open={resultModal.open}
        type={resultModal.type}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, open: false })}
      />

      <UploadToKtechRaisers
        showResultModal={showResultModal}
        uploadFormRecords={uploadFormRecords}
        setUploadFormRecords={setUploadFormRecords}
      />

      <Fab
        disabled={loading}
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={handleMarkAsUploaded}
      >
        <UploadIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard;
