import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import firebase from "../../../firebase";

let db = firebase.firestore();

function Service() {
  const [servicename, setservicename] = useState([]);
  const [selectservicename, setselectservicename] = useState(null);
  const [serviceproduct, setserviceproduct] = useState([]);
  const [session, setsession] = useState([]);
  const [selectsession, setselectsession] = useState(1);
  const [amount, setamount] = useState();
  useEffect(() => {
    db.collection("Service")
      .get()
      .then((res) => {
        res.forEach((d) => {
          setservicename((old) => [...old, d.data()]);
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
    if (selectservicename) {
      db.collection("Service")
        .doc(selectservicename)
        .collection("Package")
        .get()
        .then((res) => {
          res.forEach((d) => {
            setserviceproduct((old) => [...old, d.data()]);
          });
        });
    }
  }, [selectservicename]);
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
      {servicename ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Select Service Name</label>
            <select
              style={{
                height: "40px",
                width: "100%",
                border: "1px solid gray",
              }}
              id="service_product"
              onChange={(e) => setselectservicename(e.target.value)}
            >
              <option value={null}>Please Service Name</option>
              {servicename.length > 0
                ? servicename.map((d) => {
                    return <option value={d.value}>{d.value}</option>;
                  })
                : ""}
            </select>
          </div>
        </Col>
      ) : (
        ""
      )}
      {/*  */}
      {selectservicename ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Select Service Product</label>
            <select
              style={{
                height: "40px",
                width: "100%",
                border: "1px solid gray",
              }}
            >
              <option value={null}>Please Select Product</option>
              {serviceproduct.length > 0
                ? serviceproduct.map((d) => {
                    return <option value={d.value}>{d.value}</option>;
                  })
                : ""}
            </select>
          </div>
        </Col>
      ) : (
        ""
      )}
      {selectservicename ? (
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
      ) : (
        ""
      )}
      {selectservicename ? (
        <Col xl={6}>
          <div className="form-group">
            <label htmlFor="email">Amount</label>
            <input type="text" value={amount} className="in_T" disabled />
          </div>
        </Col>
      ) : (
        ""
      )}
    </>
  );
}

export default Service;
