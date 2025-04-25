import { Stack, Button, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import CsvExport from "../../../utils/CSV/CsvExport";
const HeaderActions = ({
  onFilterClick,
  onSearchChange,
  searchQuery,
  filters,
  loading,
  sortModel,
}) => {
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        mb={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ flexWrap: "wrap" }}
      >
        <TextField
          size="small"
          variant="outlined"
          label="Search Raiser Name"
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={onFilterClick}
            disabled={loading}
          >
            Filter
          </Button>
          <CsvExport
            url="/dashboard/fetchRecruitmentListsCSV.json"
            filename="Raisers.csv"
            queryParams={{
              search: searchQuery,
              filters: filters,
              sort: sortModel[0] || {},
            }}
            loading={loading}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default HeaderActions;
