import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import firebase from "../../../firebase";

let db = firebase.firestore();

function Product() {
  const [productname, setproductname] = useState([]);
  const [selectproductname, setselectproductname] = useState(null);
  const [session, setsession] = useState([]);
  const [selectsession, setselectsession] = useState(1);
  const [amount, setamount] = useState();
  useEffect(() => {
    db.collection("Service")
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
    if (selectsession) {
      db.collection("Session")
        .doc(`${selectsession}`)
        .get()
        .then((res) => {
          setamount(res.data().amount);
        });
    }
  }, [selectsession]);
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
                    return <option value={d.value}>{d.value}</option>;
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
              <label htmlFor="email">Select Seassion</label>
              <select
                style={{
                  height: "40px",
                  width: "100%",
                  border: "1px solid gray",
                }}
                onChange={(e) => setselectsession(e.target.value)}
              >
                {session.map((d) => {
                  return <option value={d.seassion}>{d.seassion}</option>;
                })}
              </select>
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
