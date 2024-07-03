import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';

export default function PaginatePublish(props) {
  let { total, page, rowsPerPage, pageChange } = props;


  const handleChange = (event, newPage) => {

    try {

      if (typeof newPage === 'number') {
        page = newPage
      } else {
        rowsPerPage = event.target.value;
        page = 0
      }


      pageChange({ page, rowsPerPage })

    } catch (err) { err }

  };


  return (
    <TablePagination
      component="div"
      count={Math.round(total || 0)}
      page={page || 0}
      onPageChange={handleChange}
      rowsPerPage={rowsPerPage || 25}
      onRowsPerPageChange={handleChange}
    />
  );
} 