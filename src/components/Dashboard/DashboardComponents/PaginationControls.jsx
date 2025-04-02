import { TablePagination } from "@mui/material";

const PaginationControls = ({ pagination, setPagination, total, loading }) => {
  const limit = pagination.limit || 10; // fallback safety
  const page = pagination.page || 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <TablePagination
      component="div"
      count={total}
      page={Math.min(Math.max(page - 1, 0), totalPages - 1)}
      rowsPerPage={limit}
      rowsPerPageOptions={[10, 25, 50, 100]}
      labelRowsPerPage="Rows per page"
      onPageChange={(e, newPage) => {
        if (!loading) {
          const nextPage = Math.min(Math.max(newPage + 1, 1), totalPages);
          setPagination((prev) => ({ ...prev, page: nextPage }));
        }
      }}
      onRowsPerPageChange={(e) => {
        const newLimit = parseInt(e.target.value, 10);
        if (!loading && [10, 25, 50, 100].includes(newLimit)) {
          setPagination({ page: 1, limit: newLimit, total });
        }
      }}
      nextIconButtonProps={{
        disabled: loading || page >= totalPages,
      }}
      backIconButtonProps={{
        disabled: loading || page <= 1,
      }}
    />
  );
};

export default PaginationControls;
