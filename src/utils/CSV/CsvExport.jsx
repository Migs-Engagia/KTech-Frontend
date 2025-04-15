import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Papa from "papaparse";
import axios from "../axiosInstance"; // Adjust path if needed

const CsvExport = ({
  url,
  headers,
  filename = "export.csv",
  queryParams = {},
  limit = 100,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!downloading) {
      setOpen(false);
      setProgress(0);
      setError("");
    }
  };

  useEffect(() => {
    if (open) startExport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startExport = async () => {
    setDownloading(true);
    setProgress(0);
    setError("");

    let allData = [];
    let page = 1;
    let total = null;

    try {
      while (true) {
        const res = await axios.post(url, { page, limit, ...queryParams });
        const data = res.data?.data || [];
        const totalCount = res.data?.pagination?.total;

        if (total === null) total = totalCount;
        if (data.length === 0) break;

        allData = [...allData, ...data];
        const totalPages = Math.ceil(total / limit);
        setProgress(Math.min(100, Math.round((page / totalPages) * 100)));

        if (page >= totalPages) break;
        page += 1;

        await new Promise((r) => setTimeout(r, 200)); // optional throttle
      }

      const csv = Papa.unparse(allData, { header: true });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed:", err);
      setError("CSV export failed. Please try again.");
    } finally {
      setDownloading(false);
      setTimeout(() => {
        setOpen(false);
        setProgress(0);
      }, 800);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        disabled={loading}
        onClick={handleClick}
      >
        CSV Out
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Exporting CSV</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography align="center" mt={2} fontSize={13}>
              {progress < 100
                ? `${progress}% Downloaded`
                : "Finalizing download..."}
            </Typography>
            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={downloading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CsvExport;
