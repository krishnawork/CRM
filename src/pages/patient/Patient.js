import React, { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import Patient2 from "./Patient2";
function Docterpagenation() {
  const [totallength, settotallength] = useState(0);
  const [showPerPage, setShowPerPage] = useState(10);
  const [show, setshow] = useState(true);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
  };
  useEffect(() => {
    // alert(totallength);
  }, [totallength]);
  return (
    <div>
      <Patient2
        totallength={totallength}
        settotallength={settotallength}
        showPerPage={showPerPage}
        pagination={pagination}
        setshow={setshow}
      />
      {totallength > 0 && show ? (
        <Pagination
          showPerPage={showPerPage}
          onPaginationChange={onPaginationChange}
          total={totallength}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Docterpagenation;
