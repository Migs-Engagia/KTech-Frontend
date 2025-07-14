import { useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Import CustomDatatable
import CustomDatatable from "../../Utilities/CustomDatatable";

const DashboardTable = ({
  user,
  onAction,
  loading,
  pagination,
  sortModel,
  data,
  searchQuery,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onSearchChange,
}) => {
  const isHogs = user.product_line === "Hogs/AH";

  // Convert DataGrid columns to CustomDatatable format
  const columnsData = [
    { 
      id: "raiserName", 
      headerName: "Raiser Name",
      sticky: true,
      stickyLeft: 0,
      width: 150,
    },
    { id: "province", headerName: "Province", width: 120, sticky: true, stickyLeft: 150 },
    { id: "city", headerName: "City/Municipality", width: 150, sticky: true, stickyLeft: 270 },
    { id: "barangay", headerName: "Barangay", width: 120, sticky: true, stickyLeft: 420 },
    { id: "contact", headerName: "Contact No.", width: 120, sticky: true, stickyLeft: 540 },
    ...(isHogs
      ? [
          { id: "boar", headerName: "Boars", width: 80 },
          { id: "boar_current_feeds", headerName: "Feeds", width: 80 },
          { id: "sow", headerName: "Sow", width: 80 },
          { id: "sow_current_feeds", headerName: "Feeds", width: 80 },
          { id: "gilts", headerName: "Gilts", width: 80 },
          { id: "gilt_current_feeds", headerName: "Feeds", width: 80 },
          { id: "fatteners", headerName: "Fatteners", width: 100 },
          { id: "fatteners_current_feeds", headerName: "Feeds", width: 80 },
          { id: "total", headerName: "Total", width: 80 },
          { id: "piglet", headerName: "Piglet", width: 80 },
          { id: "piglet_current_feeds", headerName: "Feeds", width: 80 },
        ]
      : [
          { id: "corded", headerName: "Corded", width: 80 },
          { id: "corded_current_feeds", headerName: "Feeds", width: 80 },
          { id: "broodhen", headerName: "Broodhen", width: 100 },
          { id: "broodhen_current_feeds", headerName: "Feeds", width: 80 },
          { id: "stag", headerName: "Stag", width: 80 },
          { id: "stag_current_feeds", headerName: "Feeds", width: 80 },
          { id: "broodcock", headerName: "Broodcock", width: 100 },
          { id: "broodcock_current_feeds", headerName: "Feeds", width: 80 },
          { id: "total", headerName: "Total", width: 80 },
          { id: "chicks", headerName: "Chicks", width: 80 },
          { id: "chick_current_feeds", headerName: "Feeds", width: 80 },
        ]),
    { id: "ktechName", headerName: "KTech Name", width: 120 },
    { id: "lkDateCreated", headerName: "LK Date Created", width: 120 },
    {
      id: "qualityRaiser",
      headerName: "Quality Raiser",
      width: 100,
      render: (row) => (row.qualityRaiser === true ? "Y" : "N"),
    },
    {
      id: "dateOfVisit",
      headerName: "Visit Date",
      width: 120,
      render: (row) =>
        row.dateOfVisit && row.dateOfVisit.length > 0 
          ? dayjs(row.dateOfVisit).format("MMMM D, YYYY") 
          : "-",
    },
    {
      id: "actions",
      headerName: "Action",
      width: 180,
      render: (row) => (
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
              >
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // CustomDatatable ref
  const datatableRef = useRef();

  return (
    <Box
      sx={{ overflow: "auto", width: "100%", boxShadow: 2, borderRadius: 3 }}
    >
      <Box
        sx={{
          minWidth: "100%",
          maxWidth: "1670px",
          mx: "auto",
          height: "650px",
        }}
      >
        <CustomDatatable
          ref={datatableRef}
          columnsData={columnsData}
          rowsData={data}
          rowsTotalCount={pagination.total}
          loading={loading}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          sort={sortModel[0] || { field: "", order: "asc" }}
          searchValue={searchQuery}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
          minWidth={1670}
        />
      </Box>
    </Box>
  );
};

DashboardTable.propTypes = {
  user: PropTypes.shape({
    product_line: PropTypes.string.isRequired,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  sortModel: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default DashboardTable;

