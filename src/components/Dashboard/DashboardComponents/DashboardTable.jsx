import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
  Tooltip,
  IconButton,
  Skeleton,
} from "@mui/material";

import TodayIcon from "@mui/icons-material/Today";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";

const DashboardTable = ({ data, selectedHeaders, user, onAction, loading }) => {
  // Number of placeholder rows to render during loading
  const skeletonRowCount = 10;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {selectedHeaders.map((header, index) => (
              <TableCell
                key={index}
                sx={{ fontWeight: "bold" }}
                align={header === "Action" ? "center" : "left"}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading
            ? Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {selectedHeaders.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton animation="wave" height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
                >
                  <TableCell>{row.raiserName}</TableCell>
                  <TableCell>{row.province}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.municipality}</TableCell>
                  <TableCell>{row.barangay}</TableCell>
                  <TableCell>{row.contact}</TableCell>

                  {user.product_line === "Hogs/AH" ? (
                    <>
                      <TableCell>{row.boar || "-"}</TableCell>
                      <TableCell>{row.sow || "-"}</TableCell>
                      <TableCell>{row.gilts || "-"}</TableCell>
                      <TableCell>{row.fatteners || "-"}</TableCell>
                      <TableCell>{row.total || "-"}</TableCell>
                      <TableCell>{row.piglet || "-"}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.corded || "-"}</TableCell>
                      <TableCell>{row.broodhen || "-"}</TableCell>
                      <TableCell>{row.stag || "-"}</TableCell>
                      <TableCell>{row.broodcock || "-"}</TableCell>
                      <TableCell>{row.total || "-"}</TableCell>
                      <TableCell>{row.chicks || "-"}</TableCell>
                    </>
                  )}

                  <TableCell>{row.existingFeed || "-"}</TableCell>
                  <TableCell>{row.ktechName || "-"}</TableCell>
                  <TableCell>{row.lkDateCreated || "-"}</TableCell>
                  <TableCell>{row.qualityRaiser ? "Y" : "N"}</TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Set Date Visited" arrow>
                        <IconButton
                          color="info"
                          onClick={() => onAction("date", row)}
                          disabled={loading}
                        >
                          <TodayIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Recruitment Status" arrow>
                        <IconButton
                          color="success"
                          onClick={() => onAction("recruit", row)}
                          disabled={loading}
                        >
                          <PersonAddAlt1Icon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bags Purchased" arrow>
                        <IconButton
                          color="warning"
                          onClick={() => onAction("bags", row)}
                          disabled={loading}
                        >
                          <LocalMallIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
