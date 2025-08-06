import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useState, useRef, useCallback, useEffect } from "react";

const DashboardTable = ({
  data,
  user,
  onAction,
  loading,
  pagination,
  setPagination,
  sortModel,
  setSortModel,
}) => {
  const isHogs = user.product_line === "Hogs/AH";

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeColumn, setResizeColumn] = useState(null);
  const tableRef = useRef(null);

  const columns = [
    { field: "raiserName", headerName: "Raiser Name", sortable: true, defaultWidth: 180 },
    { field: "province", headerName: "Province", sortable: true, defaultWidth: 140 },
    { field: "city", headerName: "City/Municipality", sortable: true, defaultWidth: 180 },
    { field: "barangay", headerName: "Barangay", sortable: true, defaultWidth: 140 },
    { field: "contact", headerName: "Contact No.", sortable: true, defaultWidth: 140 },
    ...(isHogs
      ? [
          { field: "boar", headerName: "Boars", sortable: true, defaultWidth: 100 },
          { field: "boar_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "sow", headerName: "Sow", sortable: true, defaultWidth: 100 },
          { field: "sow_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "gilts", headerName: "Gilts", sortable: true, defaultWidth: 100 },
          { field: "gilt_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "fatteners", headerName: "Fatteners", sortable: true, defaultWidth: 120 },
          { field: "fatteners_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "total", headerName: "Total", sortable: true, defaultWidth: 100 },
          { field: "piglet", headerName: "Piglet", sortable: true, defaultWidth: 100 },
          { field: "piglet_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
        ]
      : [
          { field: "corded", headerName: "Corded", sortable: true, defaultWidth: 100 },
          { field: "corded_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "broodhen", headerName: "Broodhen", sortable: true, defaultWidth: 120 },
          { field: "broodhen_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "stag", headerName: "Stag", sortable: true, defaultWidth: 100 },
          { field: "stag_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "broodcock", headerName: "Broodcock", sortable: true, defaultWidth: 120 },
          { field: "broodcock_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
          { field: "total", headerName: "Total", sortable: true, defaultWidth: 100 },
          { field: "chicks", headerName: "Chicks", sortable: true, defaultWidth: 100 },
          { field: "chick_current_feeds", headerName: "Feeds", sortable: true, defaultWidth: 120 },
        ]),
    { field: "ktechName", headerName: "KTech Name", sortable: true, defaultWidth: 140 },
    { field: "lkDateCreated", headerName: "LK Date Created", sortable: true, defaultWidth: 160 },
    {
      field: "qualityRaiser",
      headerName: "Quality Raiser",
      sortable: true,
      defaultWidth: 120,
      valueGetter: (value) => (value === true ? "Y" : "N"),
    },
    {
      field: "dateOfVisit",
      headerName: "Visit Date",
      sortable: true,
      defaultWidth: 140,
      valueGetter: (value) =>
        value && value.length > 0 ? dayjs(value).format("MMMM D, YYYY") : "-",
    },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      defaultWidth: 180,
    },
  ];

  // Frozen columns (first 5 columns)
  const frozenColumns = columns.slice(0, 5);
  const scrollableColumns = columns.slice(5);

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

  const getRowClassName = (row) =>
    row?.customerVisited === true ? "visited-row" : "";

  // Render cell value
  const renderCellValue = (row, column) => {
    if (column.field === "actions") {
      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip
            title={
              row?.customerVisited
                ? `${row.raiserName} is visited`
                : "Set Date of Visit"
            }
            arrow
          >
            <span>
              <IconButton
                color="info"
                onClick={() => onAction("date", row)}
                disabled={loading}
                size="small"
              >
                {row?.customerVisited ? (
                  <EventAvailableIcon />
                ) : (
                  <TodayIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={
              row?.recruitmentStatus === 2
                ? `${row.raiserName} is recruited`
                : "Recruitment Status"
            }
            arrow
          >
            <span>
              <IconButton
                color="success"
                onClick={() => onAction("recruit", row)}
                disabled={!row?.customerVisited || loading}
                size="small"
              >
                {row?.recruitmentStatus === 2 ? (
                  <HowToRegIcon />
                ) : (
                  <PersonAddAlt1Icon />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Bags Purchased" arrow>
            <span>
              <IconButton
                color="warning"
                onClick={() => onAction("bags", row)}
                disabled={
                  !row?.customerVisited ||
                  row?.recruitmentStatus !== 2 ||
                  loading
                }
                size="small"
              >
                <LocalMallIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Tag as Duplicate" arrow>
            <span>
              <IconButton
                color="error"
                onClick={() => onAction("duplicate", row)}
                disabled={loading}
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      );
    }

    if (column.field === "qualityRaiser") {
      return row[column.field] === true ? "Y" : "N";
    }

    if (column.field === "dateOfVisit") {
      return row[column.field] && row[column.field].length > 0 
        ? dayjs(row[column.field]).format("MMMM D, YYYY") 
        : "-";
    }

    return row[column.field] || "-";
  };

  return (
    <Box
      sx={{ overflow: "auto", width: "100%", boxShadow: 2, borderRadius: 3 }}
    >
      <Box
        sx={{
          minWidth: "100%",
          maxWidth: "1670px",
        }}
      >
        {/* Custom Table Implementation */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 700, overflow: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 1200 }} ref={tableRef}>
              <TableHead>
                <TableRow>
                  {/* Frozen Columns */}
                  {frozenColumns.map((column, index) => (
                    <TableCell
                      key={column.field}
                      sx={{
                        position: "sticky",
                        left: frozenColumns.slice(0, index).reduce((acc, col) => acc + getColumnWidth(col), 0),
                        zIndex: 4,
                        backgroundColor: "#fffdf8",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        borderRight: index === frozenColumns.length - 1 ? "2px solid #d0d0d0" : "",
                        width: getColumnWidth(column),
                        minWidth: getColumnWidth(column),
                        maxWidth: getColumnWidth(column),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        padding: "12px 16px",
                        borderBottom: "2px solid #e0e0e0",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&::after": index === frozenColumns.length - 1 ? {} : {
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
                  
                  {/* Scrollable Columns */}
                  {scrollableColumns.map((column) => (
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
                {data.length === 0 ? (
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
                      className={getRowClassName(row)}
                      sx={{
                        "&:hover": { backgroundColor: "#f8f9fa" },
                        "&.visited-row": { backgroundColor: "#e8f5e9" },
                        height: "52px",
                        "&:nth-of-type(even)": {
                          backgroundColor: row?.customerVisited ? "#e8f5e9" : "#fffdf8",
                        },
                        "&:nth-of-type(odd)": {
                          backgroundColor: row?.customerVisited ? "#e8f5e9" : "#ffffff",
                        },
                      }}
                    >
                      {/* Frozen Columns */}
                      {frozenColumns.map((column, index) => (
                        <TableCell
                          key={column.field}
                          sx={{
                            position: "sticky",
                            left: frozenColumns.slice(0, index).reduce((acc, col) => acc + getColumnWidth(col), 0),
                            zIndex: 2,
                            backgroundColor: getRowClassName(row) === "visited-row" ? "#e8f5e9" : "#fffdf8",
                            borderRight: index === frozenColumns.length - 1 ? "2px solid #d0d0d0" : "",
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
                          {renderCellValue(row, column)}
                        </TableCell>
                      ))}
                      
                      {/* Scrollable Columns */}
                      {scrollableColumns.map((column) => (
                        <TableCell
                          key={column.field}
                          sx={{
                            backgroundColor: getRowClassName(row) === "visited-row" ? "#e8f5e9" : "#fffdf8",
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
                          {renderCellValue(row, column)}
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
            rowsPerPageOptions={[10, 20, 50, 100]}
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

        {/* Original DataGrid Implementation (Commented Out) */}
        {/*
        <DataGrid
          rows={data}
          columns={columns.map((col) => {
            // Skip mapping for actions column to preserve its width setting
            if (col.field === "actions") {
              return col;
            }
            
            const smallCols = [
              "feeds",
              "chicks",
              "total",
              "quality",
              "date",
              "contact",
            ];
            const isSmall = smallCols.some((key) =>
              col.field.toLowerCase().includes(key)
            );
            return {
              ...col,
              minWidth: isSmall ? 100 : 140,
              flex: isSmall ? undefined : 1,
            };
          })}
          disableVirtualization
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
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
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          checkboxSelection={false}
          isRowSelectable={() => false}
          getRowClassName={getRowClassName}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              overflow: "visible",
              textOverflow: "unset",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              backgroundColor: "#fffdf8",
            },
            "& .MuiDataGrid-row": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .visited-row": {
              backgroundColor: "#e8f5e9",
            },
          }}
        />
        */}
      </Box>
    </Box>
  );
};

DashboardTable.propTypes = {
  data: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
};

export default DashboardTable;
