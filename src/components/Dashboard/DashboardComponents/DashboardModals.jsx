import PropTypes from "prop-types";
import DateVisitedModal from "./ActionButtons/DateVisitedModal";
import RecruitmentModal from "./ActionButtons/RecruitmentModal";
import BagsPurchasedModal from "./ActionButtons/BagsPurchasedModal";
import DuplicateRecordsModal from "./ActionButtons/DuplicateRecordsModal";

const DashboardModals = ({ openModal, row, onClose, onSaveHandlers }) => {
  return (
    <>
      <DateVisitedModal
        open={openModal === "date"}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.date(data, row);
          onClose();
        }}
        row={row}
      />

      <RecruitmentModal
        open={openModal === "recruit"}
        row={row}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.recruit(data, row);
          onClose();
        }}
      />

      <BagsPurchasedModal
        open={openModal === "bags"}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.bags(data, row);
          onClose();
        }}
        row={row}
      />

      <DuplicateRecordsModal
        open={openModal === "duplicate"}
        onClose={onClose}
      />
    </>
  );
};

DashboardModals.propTypes = {
  openModal: PropTypes.string,
  row: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaveHandlers: PropTypes.object.isRequired,
};

export default DashboardModals;
