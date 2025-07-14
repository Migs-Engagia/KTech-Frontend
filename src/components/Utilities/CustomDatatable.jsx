import { forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import styled from "@emotion/styled";

const StyledTable = styled(TableContainer)`
  th {
    font-weight: bold;
    background-color: #fafafa;
    color: rgba(0, 0, 0, 0.88);
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border-bottom: 1px solid #e0e0e0;
  }
  td {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const CustomDatatable = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}), []);
  const sort = props.sort || { field: "", order: "asc" };

  // Sorting handler: toggles order if same field, otherwise sets to asc
  const handleSortClick = (field) => {
    let order = "asc";
    if (sort.field === field && sort.order === "asc") {
      order = "desc";
    }
    props.onSortChange({ field, order });
  };

  // Helper function to get sticky styles
  const getStickyStyles = (column, isHeader = false) => {
    if (!column.sticky) return {};
    const baseStickyStyle = {
      position: "sticky",
      left: column.stickyLeft || 0,
      background: isHeader ? "#fafafa" : "#fff",
      zIndex: column.stickyZIndex || 30,
      width: column.width || 120,
    };
    if (column.sticky) {
      baseStickyStyle.borderRight = "1px solid #e0e0e0";
    }
    return baseStickyStyle;
  };

  const renderTableHead = () => (
    <TableHead>
      {props.headColumnData && props.headColumnData.length > 0 && (
        <TableRow>
          {props.headColumnData.map((headColumn, index) => (
            <TableCell
              key={index}
              align={headColumn.align}
              colSpan={headColumn.colSpan}
              sx={getStickyStyles(headColumn, true)}
            >
              {headColumn.headerName}
            </TableCell>
          ))}
        </TableRow>
      )}
      <TableRow>
        {props.columnsData.map((column, index) => (
          <TableCell
            align={column.align ? column.align : "left"}
            key={column.id}
            sx={{
              width: column.width,
              ...getStickyStyles(column, true),
              cursor: column.sorting !== false ? "pointer" : "default",
              userSelect: "none",
            }}
            onClick={column.sorting === false ? undefined : () => handleSortClick(column.id)}
          >
            {column.sorting === false ? (
              column.customHeader ? (
                column.customHeader(column, index)
              ) : (
                column.headerName
              )
            ) : (
              <TableSortLabel
                active={sort.field === column.id}
                direction={sort.field === column.id ? sort.order : "asc"}
                // Don't use onClick here, use onClick on TableCell for better UX
              >
                {column.headerName}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => (
    <TableBody>
      {props.loading ? (
        <TableRow>
          <TableCell
            colSpan={props.columnsData.length + 1}
            style={{ textAlign: "center" }}
          >
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : props.rowsData && props.rowsData.length > 0 ? (
        props.rowsData.map((row, index) => (
          <TableRow key={index}>
            {props.columnsData.map((column) => (
              <TableCell
                align={column.align ? column.align : "left"}
                key={column.id}
                sx={{
                  ...getStickyStyles(column, false),
                }}
              >
                {column.render ? (
                  column.render(row, index)
                ) : (
                  row[column.id]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={props.columnsData.length + 1}
            style={{ textAlign: "center" }}
          >
            No data available
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  const renderTableFooter = () => (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={props.columnsData.length + 1}
          count={props.rowsTotalCount}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          onPageChange={props.onPageChange}
          onRowsPerPageChange={props.onRowsPerPageChange}
        />
      </TableRow>
    </TableFooter>
  );

  return (
    <Paper sx={{ overflow: "auto" }}>
      <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <StyledTable>
          <Table sx={{ minWidth: props.minWidth ? props.minWidth : 1440 }}>
            {renderTableHead()}
            {renderTableBody()}
            {renderTableFooter()}
          </Table>
        </StyledTable>
      </Box>
    </Paper>
  );
});

CustomDatatable.displayName = "CustomDatatable";

CustomDatatable.propTypes = {
  columnsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(["left", "center", "right"]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      sorting: PropTypes.bool,
      render: PropTypes.func,
      customHeader: PropTypes.func,
      sticky: PropTypes.bool,
      stickyLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      stickyZIndex: PropTypes.number,
    })
  ).isRequired,
  headColumnData: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(["left", "center", "right"]),
      colSpan: PropTypes.number,
      sticky: PropTypes.bool,
      stickyLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      stickyZIndex: PropTypes.number,
    })
  ),
  rowsData: PropTypes.array.isRequired,
  rowsTotalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(["asc", "desc"]),
  }),
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
};

CustomDatatable.defaultProps = {
  sort: { field: "", order: "asc" },
};

export default CustomDatatable;
