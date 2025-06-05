import { Grid, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const LKDateRangePicker = ({ pendingFilters, setPendingFilters }) => {
  const handleDateOnChange = (key, val) => {
    const formattedDate = val ? dayjs(val).format("YYYY-MM-DD") : null;

    setPendingFilters((prev) => {
      let updated = { ...prev, [key]: formattedDate };
      if (
        key === "lkDateCreatedFrom" &&
        formattedDate &&
        prev.lkDateCreatedTo &&
        dayjs(formattedDate).isAfter(dayjs(prev.lkDateCreatedTo))
      ) {
        updated.lkDateCreatedTo = formattedDate;
      }

      return updated;
    });
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <DatePicker
              label="LK Date Created From"
              format="YYYY-MM-DD"
              onChange={(newValue) =>
                handleDateOnChange("lkDateCreatedFrom", newValue)
              }
              value={
                pendingFilters.lkDateCreatedFrom
                  ? dayjs(pendingFilters.lkDateCreatedFrom)
                  : null
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  size: "small",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <DatePicker
              label="LK Date Created To"
              format="YYYY-MM-DD"
              onChange={(newValue) =>
                handleDateOnChange("lkDateCreatedTo", newValue)
              }
              value={
                pendingFilters.lkDateCreatedTo
                  ? dayjs(pendingFilters.lkDateCreatedTo)
                  : null
              }
              minDate={
                pendingFilters?.lkDateCreatedFrom
                  ? dayjs(pendingFilters?.lkDateCreatedFrom)
                  : undefined
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  size: "small",
                  sx: {
                    mb: 0.5,
                    borderRadius: 1,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
};

export default LKDateRangePicker;
