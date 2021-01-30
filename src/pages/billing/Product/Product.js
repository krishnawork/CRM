import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../../../firebase";
import { AddProgramAmount, AddProgramName } from "../action/Action";

let db = firebase.firestore();

function Product() {
  const [productname, setproductname] = useState([]);
  const [selectproductname, setselectproductname] = useState(null);
  const [session, setsession] = useState([]);
  const [selectsession, setselectsession] = useState(1);
  const [amount, setamount] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    db.collection("Program")
      .get()
      .then((res) => {
        res.forEach((d) => {
          setproductname((old) => [...old, d.data()]);
        });
      });
    //
    db.collection("Session")
      .get()
      .then((res) => {
        res.forEach((d) => {
          setsession((old) => [...old, d.data()]);
        });
      });
  }, []);
  useEffect(() => {
    if (
      selectproductname === "Please Select Program Name" ||
      selectproductname === null
    ) {
      setamount(null);
      dispatch(AddProgramAmount(null));
      dispatch(AddProgramName(null));
    } else {
      db.collection("Session")
        .doc(`5`)
        .get()
        .then((res) => {
          if (res.exists) {
            setamount(res.data().amount);
            dispatch(AddProgramAmount(amount));
          } else {
            setamount(null);
            dispatch(AddProgramAmount(amount));
          }
        });
      dispatch(AddProgramName(selectproductname));
    }
  }, [selectproductname, amount]);
  return (
    <>
      {productname ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Select Program Name</label>
            <select
              style={{
                height: "40px",
                width: "100%",
                border: "1px solid gray",
              }}
              id="product_name"
              onChange={(e) => setselectproductname(e.target.value)}
            >
              <option value={null}>Please Select Program Name</option>
              {productname.length > 0
                ? productname.map((d) => {
                    return <option>{d.value}</option>;
                  })
                : ""}
            </select>
          </div>
        </Col>
      ) : (
        ""
      )}
      {selectproductname ? (
        <>
          <Col xl={6}>
            <div className="form-group">
              <label htmlFor="email">Session</label>
              <input type="text" value="5" className="in_T" disabled />
            </div>
          </Col>
          <Col xl={6}>
            <div className="form-group">
              <label htmlFor="email">Amount</label>
              <input type="text" value={amount} className="in_T" disabled />
            </div>
          </Col>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Product;
