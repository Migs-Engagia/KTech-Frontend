import { Grid, Typography, Box } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import MUICard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { green, blue, orange, red } from "@mui/material/colors";
import LoopIcon from "@mui/icons-material/Loop";
import PersonIcon from "@mui/icons-material/Person";

const MetricCard = ({ title, value, Icon, color }) => {
  return (
    <MUICard
      sx={{
        minWidth: 200,
        borderRadius: 3,
        boxShadow: 3,
        borderLeft: `6px solid ${color}`,
        backgroundColor: "#fff",
        height: "100%",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box color={color}>
            <Icon fontSize="large" />
          </Box>
        </Box>
      </CardContent>
    </MUICard>
  );
};

// Final dashboard component
const RecruitmentDashboardGuide = ({ metrics }) => {
  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Recruitment Progress Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <MetricCard
            title="No. of Quality Raisers"
            value={metrics.qualityRaisers}
            Icon={PlaylistAddCheckIcon}
            color={blue[500]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MetricCard
            title="No. of LK Work In Progress"
            value={metrics.wip}
            Icon={LoopIcon}
            color={orange[500]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MetricCard
            title="No. of LK Recruited"
            value={metrics.recruited}
            Icon={GroupAddIcon}
            color={green[500]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MetricCard
            title="No. of LK Raisers"
            value={metrics.totalRaisers}
            Icon={PersonIcon}
            color={red[500]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruitmentDashboardGuide;
