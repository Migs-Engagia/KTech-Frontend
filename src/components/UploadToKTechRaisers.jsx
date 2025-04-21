import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import axios from "../utils/axiosInstance";

const UploadToKtechRaisers = ({
  showResultModal,
  uploadFormRecords,
  setUploadFormRecords,
}) => {
  const [total, setTotal] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [uploading, setUploading] = useState(false);
  const BATCH_SIZE = 200;

  const uploadedRef = useRef(0);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (uploadFormRecords === true || uploadFormRecords === "true") {
      const run = async () => {
        await startUpload();
        setUploadFormRecords("false");
        localStorage.setItem("upload_form_records", "false");
      };
      run();
    }
  }, [uploadFormRecords]);

  const startUpload = async () => {
    abortRef.current = false;
    setUploading(true);
    setUploaded(0);
    setLastId(0);
    uploadedRef.current = 0;

    try {
      const res = await axios.get("/KTechRaisers/countKtechToUpload.json");
      if (res.data?.success) {
        const count = res.data.count;
        setTotal(count);

        if (count === 0) {
          setUploading(false);
          showResultModal("success", "No records to upload.");
          return;
        }

        await uploadBatch(count, 0);
      } else {
        throw new Error("Failed to get pending count");
      }
    } catch (err) {
      setUploading(false);
      showResultModal("error", "Error fetching pending count.");
    }
  };

  const uploadBatch = async (totalCount, lastId) => {
    if (abortRef.current) {
      console.log("Upload aborted.");
      return;
    }

    try {
      const res = await axios.post(
        "/KTechRaisers/upload-from-answered-forms.json",
        {
          limit: BATCH_SIZE,
          last_id: lastId,
        }
      );

      if (res.data?.success) {
        const batchUploaded = res.data.uploadedCount;
        const newUploaded = uploadedRef.current + batchUploaded;
        const newLastId = res.data.last_id;

        uploadedRef.current = newUploaded;
        setUploaded(newUploaded);
        setLastId(newLastId);

        if (batchUploaded === 0 || newUploaded >= totalCount) {
          setUploading(false);
          showResultModal(
            "success",
            `Upload completed (${newUploaded} records uploaded).`
          );
        } else {
          await new Promise((r) => setTimeout(r, 200));
          await uploadBatch(totalCount, newLastId);
        }
      } else {
        throw new Error(res.data?.message || "Batch upload failed");
      }
    } catch (err) {
      setUploading(false);
      showResultModal("error", "Upload error occurred.");
    }
  };

  const cancelUpload = () => {
    abortRef.current = true;
    setUploading(false);
    showResultModal("info", "Upload cancelled.");
  };

  const getPercentage = () =>
    total && uploaded ? Math.round((uploaded / total) * 100) : 0;

  return (
    <Dialog open={uploading} maxWidth="xs" fullWidth>
      <DialogTitle>Uploading Records</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Box position="relative" display="inline-flex" mt={1} mb={2}>
          <CircularProgress
            size={100}
            value={getPercentage()}
            variant="determinate"
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6" component="div" color="textPrimary">
              {`${getPercentage()}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1">
          Uploading records... {uploaded} / {total ?? "?"}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default UploadToKtechRaisers;
