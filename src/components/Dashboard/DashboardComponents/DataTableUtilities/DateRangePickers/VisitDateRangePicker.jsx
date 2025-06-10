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
        key === "visitDateFrom" &&
        formattedDate &&
        prev.visitDateTo &&
        dayjs(formattedDate).isAfter(dayjs(prev.visitDateTo))
      ) {
        updated.visitDateTo = formattedDate;
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
                handleDateOnChange("visitDateFrom", newValue)
              }
              value={
                pendingFilters.visitDateFrom
                  ? dayjs(pendingFilters.visitDateFrom)
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
                handleDateOnChange("visitDateTo", newValue)
              }
              value={
                pendingFilters.visitDateTo
                  ? dayjs(pendingFilters.visitDateTo)
                  : null
              }
              minDate={
                pendingFilters?.visitDateFrom
                  ? dayjs(pendingFilters?.visitDateFrom)
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
