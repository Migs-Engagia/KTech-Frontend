import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Stack,
  Tooltip,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";

import TodayIcon from "@mui/icons-material/Today";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Dashboard = ({ user }) => {
  const theme = useTheme();

  const handleDateVisitedClick = (row) => {
    alert(`Viewing Date of Visited for ${row.raiserName}`);
  };

  const handleRecruitmentClick = (row) => {
    alert(`Viewing Recruitment Status for ${row.raiserName}`);
  };

  const handleBagsPurchasedClick = (row) => {
    alert(`Viewing Bags Purchased for ${row.raiserName}`);
  };

  const sampleData = [
    {
      raiserName: "Ana Jane",
      province: "Laguna",
      municipality: "Sta.Rosa",
      barangay: "Brgy 4A",
      contact: "0945",
      boars: "",
      sow: "",
      gilts: "-",
      fatteners: "",
      total: "",
      piglet: "",
      existingFeed: "",
      ktechName: "",
      lkDateCreated: "",
      qualityRaiser: true,
    },
    {
      raiserName: "James Sawyer",
      province: "Laguna",
      municipality: "Sta.Rosa",
      barangay: "Brgy 4A",
      contact: "0945",
      corded: "3",
      broodhen: "",
      stag: "-",
      broodcock: "-",
      total: "-",
      chicks: "",
      existingFeed: "",
      ktechName: "",
      lkDateCreated: "",
      qualityRaiser: false,
    },
  ];

  const headers = {
    "Hogs/AH": [
      "Raiser Name",
      "Province",
      "City/Municipality",
      "Barangay",
      "Contact No.",
      "Boars",
      "Sow",
      "Gilts",
      "Fatteners",
      "Total",
      "Piglet",
      "Existing Feed",
      "KTech Name",
      "LK Date Created",
      "Quality Raiser Y/N",
      "Action",
    ],
    "SGF/PET": [
      "Raiser Name",
      "Province",
      "City/Municipality",
      "Barangay",
      "Contact No.",
      "Corded",
      "Broodhen",
      "Stag",
      "Broodcock",
      "Total",
      "Chicks",
      "Existing Feed",
      "KTech Name",
      "LK Date Created",
      "Quality Raiser Y/N",
      "Action",
    ],
  };

  const selectedHeaders = headers[user.product_line];

  if (!selectedHeaders) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Headers for product line "{user.product_line}" do not exist.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<FilterListIcon />}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />}>
            CSV Out
          </Button>
        </Stack>
      </Box>
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
            {sampleData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                }}
              >
                <TableCell>{row.raiserName}</TableCell>
                <TableCell>{row.province}</TableCell>
                <TableCell>{row.municipality}</TableCell>
                <TableCell>{row.barangay}</TableCell>
                <TableCell>{row.contact}</TableCell>

                {user.product_line === "Hogs/AH" ? (
                  <>
                    <TableCell>{row.boars || "-"}</TableCell>
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
                        onClick={() => handleDateVisitedClick(row)}
                      >
                        <TodayIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Recruitment Status" arrow>
                      <IconButton
                        color="success"
                        onClick={() => handleRecruitmentClick(row)}
                      >
                        <PersonAddAlt1Icon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Bags Purchased" arrow>
                      <IconButton
                        color="warning"
                        onClick={() => handleBagsPurchasedClick(row)}
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
    </Box>
  );
};

export default Dashboard;
