import DateVisitedModal from "./ActionButtons/DateVisitedModal";
import RecruitmentModal from "./ActionButtons/RecruitmentModal";
import BagsPurchasedModal from "./ActionButtons/BagsPurchasedModal";

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
    </>
  );
};

export default DashboardModals;
