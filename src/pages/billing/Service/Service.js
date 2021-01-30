import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import firebase from "../../../firebase";
import { useSelector, useDispatch } from "react-redux";
import {
  AddServiceAmount,
  AddServiceName,
  AddServiceProductName,
  AddServiceSession,
} from "../action/Action";

let db = firebase.firestore();

function Service() {
  const [servicename, setservicename] = useState([]);
  const [selectservicename, setselectservicename] = useState(null);
  const [serviceproduct, setserviceproduct] = useState([]);
  const [selectserviceproductname, setselectserviceproductname] = useState(
    null
  );
  const [session, setsession] = useState([]);
  const [selectsession, setselectsession] = useState(1);
  const [amount, setamount] = useState(null);
  const dispatch = useDispatch();

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
    if (
      selectservicename === "Please Select Service Name" ||
      selectservicename === null
    ) {
      dispatch(AddServiceAmount(null));
      dispatch(AddServiceName(null));
      dispatch(AddServiceSession(null));
      setserviceproduct([]);
    } else {
      db.collection("Service")
        .doc(selectservicename)
        .collection("Package")
        .get()
        .then((res) => {
          res.forEach((d) => {
            setserviceproduct((old) => [...old, d.data()]);
          });
        });
      dispatch(AddServiceAmount(amount));
      dispatch(AddServiceName(selectservicename));
      dispatch(AddServiceSession(selectsession));
    }
  }, [selectservicename, amount]);
  useEffect(() => {
    if (selectsession) {
      db.collection("Session")
        .doc(`${selectsession}`)
        .get()
        .then((res) => {
          if (res.exists) {
            setamount(res.data().amount);
          } else {
            setamount(null);
          }
        });
    }
  }, [selectsession]);
  useEffect(() => {
    if (
      selectserviceproductname === null ||
      selectserviceproductname === "Please Select Product"
    ) {
      dispatch(AddServiceProductName(null));
    } else {
      dispatch(AddServiceProductName(selectserviceproductname));
    }
  }, [selectserviceproductname]);
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
              <option value={null}>Please Select Service Name</option>
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
              onChange={(e) => setselectserviceproductname(e.target.value)}
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
