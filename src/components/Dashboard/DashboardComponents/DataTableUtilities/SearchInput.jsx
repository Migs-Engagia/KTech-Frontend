import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ searchText, setSearchText }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search raiser, province, city..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ width: 320 }}
    />
  );
};

export default SearchInput;
