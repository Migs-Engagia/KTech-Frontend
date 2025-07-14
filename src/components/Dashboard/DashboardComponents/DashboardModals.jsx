import PropTypes from "prop-types";
import DateVisitedModal from "./ActionButtons/DateVisitedModal";
import RecruitmentModal from "./ActionButtons/RecruitmentModal";
import BagsPurchasedModal from "./ActionButtons/BagsPurchasedModal";
import TagAsDuplicateModal from "./ActionButtons/TagAsDuplicateModal";
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

      <TagAsDuplicateModal
        open={openModal === "duplicate"}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.duplicate(data, row);
          onClose();
        }}
        row={row}
      />

      <DuplicateRecordsModal
        open={openModal === "duplicateRecords"}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.duplicateRecords(data, row);
          onClose();
        }}
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
