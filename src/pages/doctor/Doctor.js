import React, { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import Doctor2 from "./Doctor2";
function Docterpagenation() {
  const [totallength, settotallength] = useState(0);
  const [showPerPage, setShowPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
  };

  return (
    <div>
      <Doctor2
        totallength={totallength}
        settotallength={settotallength}
        showPerPage={showPerPage}
        pagination={pagination}
      />
      {totallength > 0 ? (
        <Pagination
          showPerPage={showPerPage}
          onPaginationChange={onPaginationChange}
          total={totallength}
        />
      ) : (
        "loading"
      )}
    </div>
  );
}

export default Docterpagenation;
