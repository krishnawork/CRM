import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./pagination.css";

const Paginationmain = ({ showPerPage, onPaginationChange, total }) => {
  const [counter, setCounter] = useState(1);
  const [numberOfButtons, setNumberOfButoons] = useState(
    Math.ceil(total / showPerPage)
  );

  useEffect(() => {
    const value = showPerPage * counter;
    onPaginationChange(value - showPerPage, value);
  }, [counter]);

  const onButtonClick = (type) => {
    if (type === "prev") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "next") {
      if (numberOfButtons === counter) {
        setCounter(counter);
      } else {
        setCounter(counter + 1);
      }
    }
  };
  return (
    <div className="pagination_line">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <button className="page-link" onClick={() => onButtonClick("prev")}>
              Previous
            </button>
          </li>

          {new Array(numberOfButtons).fill("").map((el, index) => (
            <li
              className={`page-item ${
                index + 1 === counter ? "colorchange" : null
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCounter(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link" onClick={() => onButtonClick("next")}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      {/*  */}
    </div>
  );
};

export default Paginationmain;
