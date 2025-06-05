import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import dayjs from "dayjs";

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

  const columns = [
    { field: "raiserName", headerName: "Raiser Name" },
    { field: "province", headerName: "Province" },
    { field: "city", headerName: "City/Municipality" },
    { field: "barangay", headerName: "Barangay" },
    { field: "contact", headerName: "Contact No." },
    ...(isHogs
      ? [
          { field: "boar", headerName: "Boars" },
          { field: "boar_current_feeds", headerName: "Feeds" },
          { field: "sow", headerName: "Sow" },
          { field: "sow_current_feeds", headerName: "Feeds" },
          { field: "gilts", headerName: "Gilts" },
          { field: "gilt_current_feeds", headerName: "Feeds" },
          { field: "fatteners", headerName: "Fatteners" },
          { field: "fattener_current_feeds", headerName: "Feeds" },
          { field: "total", headerName: "Total" },
          { field: "piglet", headerName: "Piglet" },
          { field: "piglet_current_feeds", headerName: "Feeds" },
        ]
      : [
          { field: "corded", headerName: "Corded" },
          { field: "corded_current_feeds", headerName: "Feeds" },
          { field: "broodhen", headerName: "Broodhen" },
          { field: "broodhen_current_feeds", headerName: "Feeds" },
          { field: "stag", headerName: "Stag" },
          { field: "stag_current_feeds", headerName: "Feeds" },
          { field: "broodcock", headerName: "Broodcock" },
          { field: "broodcock_current_feeds", headerName: "Feeds" },
          { field: "total", headerName: "Total" },
          { field: "chicks", headerName: "Chicks" },
          { field: "chick_current_feeds", headerName: "Feeds" },
        ]),
    { field: "ktechName", headerName: "KTech Name" },
    { field: "lkDateCreated", headerName: "LK Date Created" },
    {
      field: "qualityRaiser",
      headerName: "Quality Raiser",
      valueGetter: (value) => (value === true ? "Y" : "N"),
    },
    {
      field: "dateOfVisit",
      headerName: "Visit Date",
      valueGetter: (value) =>
        value && value.length > 0 ? dayjs(value).format("MMMM D, YYYY") : "-",
    },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip
            title={
              params?.row?.customerVisited
                ? `${params.row.raiserName} is visited`
                : "Set Date of Visit"
            }
            arrow
          >
            <span>
              <IconButton
                color="info"
                onClick={() => onAction("date", params.row)}
                disabled={loading}
              >
                {params?.row?.customerVisited ? (
                  <EventAvailableIcon />
                ) : (
                  <TodayIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={
              params?.row?.recruitmentStatus === 2
                ? `${params.row.raiserName} is recruited`
                : "Recruitment Status"
            }
            arrow
          >
            <span>
              <IconButton
                color="success"
                onClick={() => onAction("recruit", params.row)}
                disabled={!params?.row?.customerVisited || loading}
              >
                {params?.row?.recruitmentStatus === 2 ? (
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
                onClick={() => onAction("bags", params.row)}
                disabled={
                  !params?.row?.customerVisited ||
                  params?.row?.recruitmentStatus !== 2 ||
                  loading
                }
              >
                <LocalMallIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const getRowClassName = (params) =>
    params?.row?.customerVisited === true ? "visited-row" : "";

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
        <DataGrid
          rows={data}
          columns={columns.map((col) => {
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
      </Box>
    </Box>
  );
};

export default DashboardTable;
