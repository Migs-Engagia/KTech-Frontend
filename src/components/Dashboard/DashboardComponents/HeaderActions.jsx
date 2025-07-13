import PropTypes from "prop-types";
import { Stack, Button, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import CsvExport from "../../../utils/CSV/CsvExport";
const HeaderActions = ({
  onFilterClick,
  onDuplicateClick,
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
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={onDuplicateClick}
            disabled={loading}
          >
            Duplicate Records
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

HeaderActions.propTypes = {
  onFilterClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  sortModel: PropTypes.array.isRequired,
};

export default HeaderActions;
