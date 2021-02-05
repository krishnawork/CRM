import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import firebase from "../../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { AddPaidAmount, AddPaidTestName } from "../action/Action";

let db = firebase.firestore();

function Paid() {
  const paidtestname = useSelector((state) => state.paidtestname);
  const [paidname, setpaidname] = useState([]);
  const [selectpaidname, setselectpaidname] = useState(paidtestname);
  const [amount, setamount] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    db.collection("Paid")
      .get()
      .then((res) => {
        res.forEach((d) => {
          setpaidname((old) => [...old, d.data()]);
        });
      });
    //
  }, []);
  useEffect(() => {
    if (
      selectpaidname === "Please Select Test Name" ||
      selectpaidname === null
    ) {
      setamount(null);
      dispatch(AddPaidAmount(amount));
      dispatch(AddPaidTestName(null));
    } else {
      db.collection("Paid")
        .doc(`${selectpaidname}`)
        .get()
        .then((res) => {
          if (res.exists) {
            setamount(res.data().amount);
            dispatch(AddPaidAmount(amount));
          } else {
            setamount(null);
            dispatch(AddPaidAmount(amount));
          }
          dispatch(AddPaidTestName(selectpaidname));
        });
    }
  }, [selectpaidname, amount]);

  return (
    <>
      {paidname ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Select Paid Test Name</label>
            <select
              style={{
                height: "40px",
                width: "100%",
                border: "1px solid gray",
              }}
              id="product_name"
              onChange={(e) => setselectpaidname(e.target.value)}
            >
              <option value={selectpaidname}>{selectpaidname}</option>
              <option value={null}>Please Select Test Name</option>
              {paidname.length > 0
                ? paidname.map((d) => {
                    return <option value={d.value}>{d.value}</option>;
                  })
                : ""}
            </select>
          </div>
        </Col>
      ) : (
        ""
      )}

      {selectpaidname ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Amount</label>
            <input
              type="text"
              value={amount ? amount : ""}
              className="in_T"
              disabled
            />
          </div>
        </Col>
      ) : (
        ""
      )}
    </>
  );
}

export default Paid;
