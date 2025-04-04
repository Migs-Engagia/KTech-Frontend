import DateVisitedModal from "./ActionButtons/DateVisitedModal";
import RecruitmentModal from "./ActionButtons/RecruitmentModal";
import BagsPurchasedModal from "./ActionButtons/BagsPurchasedModal";

const DashboardModals = ({ openModal, row, onClose, onSaveHandlers }) => {
  return (
    <>
      <DateVisitedModal
        open={openModal === "date"}
        onClose={onClose}
        onSave={(date) => {
          onSaveHandlers.date(date, row);
          onClose();
        }}
        row={row}
      />

      <RecruitmentModal
        open={openModal === "recruit"}
        onClose={onClose}
        onSave={(data) => {
          onSaveHandlers.recruit(data, row);
          onClose();
        }}
        row={row}
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
