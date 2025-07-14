import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

import axios from "../../../../utils/axiosInstance";
import CsvExport from "../../../../utils/CSV/CsvExport";

const DuplicateRecordsModal = ({ open, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortModel, setSortModel] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    province: "All",
    city: "All",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    cities: [],
  });

  // Columns for duplicate records table
  const columns = [
    { field: "raiser_name", headerName: "Raiser Name", flex: 1, minWidth: 150 },
    { field: "province", headerName: "Province", flex: 1, minWidth: 120 },
    { field: "city", headerName: "City/Municipality", flex: 1, minWidth: 150 },
    { field: "ktech_name", headerName: "Ktech Name", flex: 1, minWidth: 120 },
    {
      field: "lk_date_created",
      headerName: "LK Date Created",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "visit_date",
      headerName: "Visit Date",
      flex: 1,
      minWidth: 120
    },
    {
      field: "archive_remarks",
      headerName: "Remarks",
      flex: 1,
      minWidth: 150
    },
    {
        field: "tagged_by",
        headerName: "Tagged By",
        flex: 1,
        minWidth: 150
    },
    {
      field: "tagged_date",
      headerName: "Tagged Date",
      flex: 1,
      minWidth: 180
    },
  ];

  // Fetch duplicate records
  const fetchDuplicateRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/dashboard/fetchDuplicateRecords.json", {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery.trim(),
        filters: filters,
        sort: sortModel[0] || {},
      });

      const { data } = response.data;
      setData(data);
      setPagination((prev) => ({
        ...prev,
        total: response?.data?.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching duplicate records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("/dashboard/fetchDuplicateFilterOptions.json");
      const { data } = response.data;
      setFilterOptions(data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDuplicateRecords();
      fetchFilterOptions();
    }
  }, [open, pagination.page, pagination.limit, searchQuery, filters, sortModel]);

  const handleSortModelChange = (model) => {
    setSortModel(model);
  };

  const handleClose = () => {
    setSearchQuery("");
    setFilters({
      province: "All",
      city: "All",
    });
    setSortModel([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
    });
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
        PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Duplicate Records</Typography>
            <Button
              onClick={handleClose}
              startIcon={<CloseIcon />}
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Header Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                label="Search Raiser Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: 250 }}
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<FilterListIcon />}
                  onClick={() => setFilterModalOpen(true)}
                  disabled={loading}
                >
                  Filter
                </Button>
                <CsvExport
                  url="/dashboard/fetchDuplicateRecordsCSV.json"
                  filename="DuplicateRecords.csv"
                  queryParams={{
                    search: searchQuery,
                    filters: filters,
                    sort: sortModel[0] || {},
                  }}
                  loading={loading}
                />
              </Stack>
            </Box>

            {/* Data Table */}
            <Box sx={{ height: "calc(90vh - 200px)", width: "100%" }}>
              <DataGrid
                rows={data}
                columns={columns}
                disableVirtualization
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row.id}
                loading={loading}
                paginationMode="server"
                paginationModel={{
                  page: pagination.page - 1,
                  pageSize: pagination.limit,
                }}
                onPaginationModelChange={({ page, pageSize }) =>
                  setPagination((prev) => ({
                    ...prev,
                    page: page + 1,
                    limit: pageSize,
                  }))
                }
                rowCount={pagination.total}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #e0e0e0",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        {/* Filter Dialog */}
        <FilterDialog
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={() => setFilterModalOpen(false)}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      </Dialog>
    </>
  );
};

// Filter Dialog Component
const FilterDialog = ({
  open,
  onClose,
  onApply,
  filters,
  setFilters,
  filterOptions,
}) => {
  const [pendingFilters, setPendingFilters] = useState({
    province: "All",
    city: "All",
  });

  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  const handleApply = () => {
    setFilters(pendingFilters);
    onApply();
  };

  const clearFilters = () => {
    setPendingFilters({
      province: "All",
      city: "All",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
      Filter Duplicate Records
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Province"
            select
            fullWidth
            value={pendingFilters.province}
            onChange={(e) =>
              setPendingFilters((prev) => ({
                ...prev,
                province: e.target.value,
              }))
            }
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.provinces?.map((prov) => (
              <MenuItem key={prov} value={prov}>
                {prov}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="City/Municipality"
            select
            fullWidth
            value={pendingFilters.city}
            onChange={(e) =>
              setPendingFilters((prev) => ({
                ...prev,
                city: e.target.value,
              }))
            }
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.cities?.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>


        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={clearFilters}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes for DuplicateRecordsModal
DuplicateRecordsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// PropTypes for FilterDialog
FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  filterOptions: PropTypes.object.isRequired,
};

export default DuplicateRecordsModal; 