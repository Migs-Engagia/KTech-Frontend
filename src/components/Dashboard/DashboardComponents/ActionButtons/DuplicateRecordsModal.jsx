import { useState, useEffect, useRef, useCallback } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
    ktech_name: "All",
    lk_date_from: null,
    lk_date_to: null,
    visit_date_from: null,
    visit_date_to: null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    cities: [],
    ktech_names: [],
  });

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeColumn, setResizeColumn] = useState(null);
  const tableRef = useRef(null);

  // Columns for duplicate records table
  const columns = [
    { field: "raiser_name", headerName: "Raiser Name", sortable: true, defaultWidth: 180 },
    { field: "province", headerName: "Province", sortable: true, defaultWidth: 140 },
    { field: "city", headerName: "City/Municipality", sortable: true, defaultWidth: 180 },
    { field: "ktech_name", headerName: "Ktech Name", sortable: true, defaultWidth: 140 },
    { field: "lk_date_created", headerName: "LK Date Created", sortable: true, defaultWidth: 160 },
    { field: "visit_date", headerName: "Visit Date", sortable: true, defaultWidth: 140 },
    { field: "archive_remarks", headerName: "Remarks", sortable: true, defaultWidth: 150 },
    { field: "tagged_by", headerName: "Tagged By", sortable: true, defaultWidth: 150 },
    { field: "tagged_date", headerName: "Tagged Date", sortable: true, defaultWidth: 180 },
  ];

  // Fetch duplicate records
  const fetchDuplicateRecords = async () => {
    try {
      setLoading(true);
      
      // Prepare sort object with proper structure - only send when user has selected a sort
      const sortObject = sortModel.length > 0 ? {
        field: sortModel[0].field,
        sort: sortModel[0].sort || 'asc'
      } : null;

      // Format dates in Y-m-d format for backend
      const formattedFilters = {
        ...filters,
        lk_date_from: filters.lk_date_from ? filters.lk_date_from.format('YYYY-MM-DD') : null,
        lk_date_to: filters.lk_date_to ? filters.lk_date_to.format('YYYY-MM-DD') : null,
        visit_date_from: filters.visit_date_from ? filters.visit_date_from.format('YYYY-MM-DD') : null,
        visit_date_to: filters.visit_date_to ? filters.visit_date_to.format('YYYY-MM-DD') : null,
      };

      console.log('Sort model:', sortModel);
      console.log('Sort object being sent:', sortObject);
      console.log('Formatted filters:', formattedFilters);

      const response = await axios.post("/dashboard/fetchDuplicateRecords.json", {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery.trim(),
        filters: formattedFilters,
        sort: sortObject,
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

  // Get column width with fallback to default
  const getColumnWidth = (column) => {
    return columnWidths[column.field] || column.defaultWidth;
  };

  // Column resizing handlers
  const handleResizeStart = useCallback((e, column) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeColumn(column);
    setResizeStartX(e.clientX);
  }, []);

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !resizeColumn) return;
    
    const deltaX = e.clientX - resizeStartX;
    const newWidth = Math.max(80, getColumnWidth(resizeColumn) + deltaX);
    
    setColumnWidths(prev => ({
      ...prev,
      [resizeColumn.field]: newWidth
    }));
    
    setResizeStartX(e.clientX);
  }, [isResizing, resizeColumn, resizeStartX, getColumnWidth]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeColumn(null);
  }, []);

  // Add event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Sorting function - use server-side sorting
  const handleRequestSort = (property) => {
    const isAsc = sortModel[0]?.field === property && sortModel[0]?.sort === "asc";
    const newSortModel = [{
      field: property,
      sort: isAsc ? "desc" : "asc"
    }];
    setSortModel(newSortModel);
  };

  // Pagination handlers - use server-side pagination
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage + 1, // Convert to 1-based indexing
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page
      limit: newPageSize,
    }));
  };



  const handleClose = () => {
    setSearchQuery("");
    setFilters({
      province: "All",
      city: "All",
      ktech_name: "All",
      lk_date_from: null,
      lk_date_to: null,
      visit_date_from: null,
      visit_date_to: null,
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
                  headers={columns.map(col => col.headerName)}
                  queryParams={{
                    search: searchQuery,
                    filters: {
                      ...filters,
                      lk_date_from: filters.lk_date_from ? filters.lk_date_from.format('YYYY-MM-DD') : null,
                      lk_date_to: filters.lk_date_to ? filters.lk_date_to.format('YYYY-MM-DD') : null,
                      visit_date_from: filters.visit_date_from ? filters.visit_date_from.format('YYYY-MM-DD') : null,
                      visit_date_to: filters.visit_date_to ? filters.visit_date_to.format('YYYY-MM-DD') : null,
                    },
                    sort: sortModel.length > 0 ? {
                      field: sortModel[0].field,
                      sort: sortModel[0].sort || 'asc'
                    } : null,
                  }}
                  loading={loading}
                />
              </Stack>
            </Box>

            {/* Data Table */}
            <Box sx={{ height: "calc(90vh - 200px)", width: "100%" }}>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: "calc(90vh - 280px)", overflow: "auto" }}>
                  <Table stickyHeader sx={{ minWidth: 1200 }} ref={tableRef}>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.field}
                            sx={{
                              backgroundColor: "#fffdf8",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              width: getColumnWidth(column),
                              minWidth: getColumnWidth(column),
                              maxWidth: getColumnWidth(column),
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              padding: "12px 16px",
                              borderBottom: "2px solid #e0e0e0",
                              position: "sticky",
                              top: 0,
                              zIndex: 3,
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                right: 0,
                                top: "25%",
                                bottom: "25%",
                                width: "2px",
                                backgroundColor: "#e0e0e0",
                                zIndex: 1,
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Box sx={{ flex: 1 }}>
                                {column.sortable ? (
                                  <TableSortLabel
                                    active={sortModel[0]?.field === column.field}
                                    direction={sortModel[0]?.field === column.field ? sortModel[0]?.sort : "asc"}
                                    onClick={() => handleRequestSort(column.field)}
                                    sx={{ 
                                      "&.MuiTableSortLabel-root": {
                                        color: "#000000",
                                        "&.Mui-active": {
                                          color: "#1976d2",
                                        },
                                        "&:hover": {
                                          color: "#1976d2",
                                        },
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "#000000",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {column.headerName}
                                    </Typography>
                                  </TableSortLabel>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#000000",
                                      fontWeight: 600,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {column.headerName}
                                  </Typography>
                                )}
                              </Box>
                              {/* Resize handle */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: "4px",
                                  cursor: "col-resize",
                                  backgroundColor: "transparent",
                                  "&:hover": {
                                    backgroundColor: "#1976d2",
                                  },
                                }}
                                onMouseDown={(e) => handleResizeStart(e, column)}
                              />
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            sx={{
                              textAlign: "center",
                              padding: "60px 16px",
                              backgroundColor: "#fffdf8",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  border: "2px solid #f3f3f3",
                                  borderTop: "2px solid #1976d2",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                  "@keyframes spin": {
                                    "0%": { transform: "rotate(0deg)" },
                                    "100%": { transform: "rotate(360deg)" },
                                  },
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#666",
                                  fontSize: "1rem",
                                  fontWeight: 500,
                                }}
                              >
                                Loading...
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : data.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            sx={{
                              textAlign: "center",
                              padding: "60px 16px",
                              backgroundColor: "#fffdf8",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#666",
                                fontSize: "1rem",
                                fontWeight: 500,
                              }}
                            >
                              No results found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:hover": { backgroundColor: "#f8f9fa" },
                              height: "52px",
                              "&:nth-of-type(even)": {
                                backgroundColor: "#fffdf8",
                              },
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#ffffff",
                              },
                            }}
                          >
                            {columns.map((column) => (
                              <TableCell
                                key={column.field}
                                sx={{
                                  backgroundColor: "inherit",
                                  width: getColumnWidth(column),
                                  minWidth: getColumnWidth(column),
                                  maxWidth: getColumnWidth(column),
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                  borderBottom: "1px solid #e0e0e0",
                                }}
                              >
                                {row[column.field] || "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={pagination.total || 0}
                  rowsPerPage={pagination.limit || 10}
                  page={(pagination.page || 1) - 1} // Convert to 0-based indexing
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: "1px solid #e0e0e0",
                    backgroundColor: "#fffdf8",
                  }}
                />
              </Paper>
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
    ktech_name: "All",
    lk_date_from: null,
    lk_date_to: null,
    visit_date_from: null,
    visit_date_to: null,
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
      ktech_name: "All",
      lk_date_from: null,
      lk_date_to: null,
      visit_date_from: null,
      visit_date_to: null,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        Filter Duplicate Records
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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

            <TextField
              label="Ktech Name"
              select
              fullWidth
              value={pendingFilters.ktech_name}
              onChange={(e) =>
                setPendingFilters((prev) => ({
                  ...prev,
                  ktech_name: e.target.value,
                }))
              }
            >
              <MenuItem value="All">All</MenuItem>
              {filterOptions.ktech_names?.map((ktech) => (
                <MenuItem key={ktech} value={ktech}>
                  {ktech}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                LK Date Created Range
              </Typography>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="From Date"
                  value={pendingFilters.lk_date_from}
                  onChange={(newValue) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      lk_date_from: newValue,
                    }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DatePicker
                  label="To Date"
                  value={pendingFilters.lk_date_to}
                  onChange={(newValue) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      lk_date_to: newValue,
                    }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Visit Date Range
              </Typography>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="From Date"
                  value={pendingFilters.visit_date_from}
                  onChange={(newValue) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      visit_date_from: newValue,
                    }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DatePicker
                  label="To Date"
                  value={pendingFilters.visit_date_to}
                  onChange={(newValue) =>
                    setPendingFilters((prev) => ({
                      ...prev,
                      visit_date_to: newValue,
                    }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>
            </Box>
          </Stack>
        </LocalizationProvider>
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