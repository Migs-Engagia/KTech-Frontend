import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const ViewAssignedRolesDialog = ({ open, onClose, routine }) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          p: 2,
        }}
      >
        Assigned Job Roles for Routine code -{" "}
        {routine?.routine_code || "Routine"}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {routine &&
        routine.assigned_roles &&
        routine.assigned_roles.length > 0 ? (
          <List>
            {routine.assigned_roles.map((role, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={role.official_designation || role.job_role_code}
                  secondary={`Code: ${role.job_role_code}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No assigned roles found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            outline: "none",
            boxShadow: "none",
            "&:focus, &:active": { outline: "none", boxShadow: "none" },
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssignedRolesDialog;
