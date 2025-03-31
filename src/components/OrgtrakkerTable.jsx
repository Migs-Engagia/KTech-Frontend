import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";

// Generic OrgtrakkerTable Component
const OrgtrakkerTable = ({
  headers,
  data,
  renderRow,
  onDelete,
  onEdit,
  onView,
  disabled = false,
  loading = false,
  loadingMessage = "Loading...",
  pagination = false,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  hasFetched = false, // New prop
}) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 0 }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                <Typography>{loadingMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                {renderRow(item, index, onDelete, onEdit, onView, disabled)}
              </TableRow>
            ))
          ) : hasFetched ? (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                <Typography>No data available</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Rows per page:"
        />
      )}
    </TableContainer>
  );
};

export default OrgtrakkerTable;