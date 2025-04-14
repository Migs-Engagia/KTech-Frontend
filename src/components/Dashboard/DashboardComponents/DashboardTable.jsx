import { DataGrid } from "@mui/x-data-grid";
import { Box, Stack, IconButton, Tooltip } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import HowToRegIcon from "@mui/icons-material/HowToReg";
const DashboardTable = ({
  data,
  user,
  onAction,
  loading,
  pagination,
  setPagination,
}) => {
  const isHogs = user.product_line === "Hogs/AH";

  const columns = [
    { field: "raiserName", headerName: "Raiser Name", flex: 1, minWidth: 150 },
    { field: "province", headerName: "Province", flex: 1, minWidth: 100 },
    { field: "city", headerName: "City", flex: 1, minWidth: 100 },
    {
      field: "municipality",
      headerName: "Municipality",
      flex: 1,
      minWidth: 100,
    },
    { field: "barangay", headerName: "Barangay", flex: 1, minWidth: 100 },
    { field: "contact", headerName: "Contact No.", flex: 1, minWidth: 130 },

    ...(isHogs
      ? [
          { field: "boar", headerName: "Boars", flex: 0.5 },
          { field: "sow", headerName: "Sow", flex: 0.5 },
          { field: "gilts", headerName: "Gilts", flex: 0.5 },
          { field: "fatteners", headerName: "Fatteners", flex: 0.5 },
          { field: "total", headerName: "Total", flex: 0.5 },
          { field: "piglet", headerName: "Piglet", flex: 0.5 },
        ]
      : [
          { field: "corded", headerName: "Corded", flex: 0.5 },
          { field: "broodhen", headerName: "Broodhen", flex: 0.5 },
          { field: "stag", headerName: "Stag", flex: 0.5 },
          { field: "broodcock", headerName: "Broodcock", flex: 0.5 },
          { field: "total", headerName: "Total", flex: 0.5 },
          { field: "chicks", headerName: "Chicks", flex: 0.5 },
        ]),

    { field: "existingFeed", headerName: "Existing Feed", flex: 1 },
    { field: "ktechName", headerName: "KTech Name", flex: 1 },
    { field: "lkDateCreated", headerName: "LK Date Created", flex: 1 },
    {
      field: "qualityRaiser",
      headerName: "Quality Raiser",
      flex: 1,
      valueGetter: (value) => (value === true ? "Y" : "N"),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1.2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center" width="100%">
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
                disabled={!params?.row?.customerVisited || loading}
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
    params.row.qualityRaiser === true ? "quality-row" : "";

  return (
    <Box sx={{ width: "100%", overflowX: { xs: "scroll", md: "auto" } }}>
      <Box sx={{ minWidth: 1200 }}>
        <DataGrid
          rows={data}
          columns={columns.map((col) => ({
            ...col,
            minWidth: col.flex ? undefined : 120, // fallback for fixed-width columns
            headerClassName: "wrapped-header",
          }))}
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
          autoHeight
          disableRowSelectionOnClick
          checkboxSelection={false}
          isRowSelectable={() => false}
          getRowClassName={getRowClassName}
          sx={{
            minWidth: "100%",
            overflowX: "auto",
            "& .quality-row": {
              backgroundColor: "#e8f5e9",
            },

            "& .wrapped-header .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: 1.2,
              wordWrap: "break-word",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardTable;
