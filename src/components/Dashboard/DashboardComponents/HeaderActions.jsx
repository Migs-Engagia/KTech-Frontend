import { Stack, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const HeaderActions = ({ onFilterClick, onExportClick, loading }) => {
  return (
    <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">
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
        startIcon={<FileDownloadIcon />}
        onClick={onExportClick}
        disabled={loading}
      >
        CSV Out
      </Button>
    </Stack>
  );
};

export default HeaderActions;
