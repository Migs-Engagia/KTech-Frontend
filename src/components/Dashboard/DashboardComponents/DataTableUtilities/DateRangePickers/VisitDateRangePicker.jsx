import { Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const VisitDateRangePicker = ({ pendingFilters, setPendingFilters }) => {
  const handleDateOnChange = (key, val) => {
    const formattedDate = val ? dayjs(val).format("YYYY-MM-DD") : null;

    setPendingFilters((prev) => {
      let updated = { ...prev, [key]: formattedDate };
      if (
        key === "VisitDateFrom" &&
        formattedDate &&
        prev.VisitDateTo &&
        dayjs(formattedDate).isAfter(dayjs(prev.VisitDateTo))
      ) {
        updated.VisitDateTo = formattedDate;
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
              label="Visit Date From"
              format="YYYY-MM-DD"
              onChange={(newValue) =>
                handleDateOnChange("VisitDateFrom", newValue)
              }
              value={
                pendingFilters.VisitDateFrom
                  ? dayjs(pendingFilters.VisitDateFrom)
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
              label="Visit Date To"
              format="YYYY-MM-DD"
              onChange={(newValue) =>
                handleDateOnChange("VisitDateTo", newValue)
              }
              value={
                pendingFilters.VisitDateTo
                  ? dayjs(pendingFilters.VisitDateTo)
                  : null
              }
              minDate={
                pendingFilters?.VisitDateFrom
                  ? dayjs(pendingFilters?.VisitDateFrom)
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

export default VisitDateRangePicker;
