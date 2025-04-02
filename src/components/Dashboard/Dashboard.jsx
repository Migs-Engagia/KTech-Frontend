import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";

import HeaderActions from "./DashboardComponents/HeaderActions";
import DashboardTable from "./DashboardComponents/DashboardTable";
import PaginationControls from "./DashboardComponents/PaginationControls";
import DashboardModals from "./DashboardComponents/DashboardModals";
import FilterDialog from "./DashboardComponents/DataTableUtilities/FilterDialog";

import axios from "../../utils/axiosInstance";

const Dashboard = ({ user }) => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    province: "All",
    city: "All",
    municipality: "All",
    qualityRaiser: "All",
    visited: "All",
  });

  const filterOptions = {
    provinces: ["Laguna"],
    cities: ["Calamba", "San Pedro"],
    municipalities: ["Sta.Rosa"],
  };

  const headers = {
    "Hogs/AH": [
      "Raiser Name",
      "Province",
      "City",
      "Municipality",
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
      "Municipality",
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

  const selectedHeaders = headers[user.product_line];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          "/dashboard/fetchRecruitmentLists.json",
          {
            page: pagination.page,
            limit: pagination.limit,
          }
        );

        const { data, pagination: meta } = response.data;
        setData(data);

        const total = meta.total;
        const limit = pagination.limit || 10;
        const maxPage = Math.max(1, Math.ceil(total / limit));
        const currentPage = Math.min(pagination.page, maxPage);

        setPagination((prev) => ({
          ...prev,
          total,
          page: currentPage,
          limit,
        }));
      } catch (error) {
        console.error("Error fetching recruitment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit, user]);

  const handleActionClick = (type, row) => {
    setActiveRow(row);
    setOpenModal(type);
  };

  const handleCloseModal = () => {
    setOpenModal("");
    setActiveRow(null);
  };

  const handleExportCSV = () => {
    console.log("TODO: Export CSV");
  };

  const handleSaveHandlers = {
    date: (date, row) => {
      console.log("Saved Date Visited:", date, row);
    },
    recruit: (data, row) => {
      console.log("Saved Recruitment:", data, row);
    },
    bags: (data, row) => {
      console.log("Saved Bags Purchased:", data, row);
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <HeaderActions
        onFilterClick={() => setFilterModalOpen(true)}
        onExportClick={handleExportCSV}
      />

      <DashboardTable
        data={data}
        selectedHeaders={selectedHeaders}
        user={user}
        onAction={handleActionClick}
        loading={loading}
      />

      <PaginationControls
        pagination={pagination}
        setPagination={setPagination}
        total={pagination.total}
        loading={loading}
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
        options={filterOptions}
      />
    </Box>
  );
};

export default Dashboard;
