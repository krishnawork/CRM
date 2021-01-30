import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import firebase from "../../firebase";
import TextField from "@material-ui/core/TextField";
import { Height } from "@material-ui/icons";
import Service from "./Service/Service";
import Product from "./Product/Product";
import Paid from "./Paid/Paid";
import { fname, lname, mnumber } from "./action/Action";
import { useSelector, useDispatch } from "react-redux";

import "./Billing_details.css";
let db = firebase.firestore();
function Billing_details({ id }) {
  const [user_details, setuser_details] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      db.collection("web_user")
        .doc(id)
        .get()
        .then((res) => {
          setuser_details([]);
          if (res) {
            setuser_details((old) => [...old, res.data()]);
            dispatch(fname(res.data().fname));
            if (res.data().lname) {
              dispatch(lname(res.data().lname));
            }
            if (res.data().number) {
              dispatch(mnumber(res.data().number));
            }
          }
        });

      //

      //
    }
  }, [id]);

  return (
    <>
      {user_details.length > 0 ? (
        user_details.map((d) => {
          return (
            <>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="email">FirstName</label>
                  <input
                    type="text"
                    value={d.fname}
                    className="in_T"
                    disabled
                  />
                </div>
              </Col>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="email">LastName</label>
                  <input
                    type="text"
                    value={d.lname}
                    className="in_T"
                    placeholder=""
                    disabled
                  />
                </div>
              </Col>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="email">Mobile Number</label>
                  <input
                    type="text"
                    value={d.number}
                    className="in_T"
                    placeholder=""
                    disabled
                  />
                </div>
              </Col>
              {/*  */}
              <Col xl={12}>
                <hr />
              </Col>
              <Service />
              <Col xl={12}>
                <hr />
              </Col>
              {/*  */}

              <Product />
              <Col xl={12}>
                <hr />
              </Col>
              <Paid />
              <Col xl={12}>
                <hr />
              </Col>
            </>
          );
        })
      ) : (
        <>
          <Col xl={6}>
            <div className="form-group">
              <label htmlFor="email">FirstName</label>
              <input
                type="text"
                placeholder="FirstName"
                className="in_T"
                disabled
              />
            </div>
          </Col>
          <Col xl={6}>
            <div className="form-group">
              <label htmlFor="email">LastName</label>
              <input
                type="text"
                placeholder="LastName"
                className="in_T"
                disabled
              />
            </div>
          </Col>
          <Col xl={6}>
            <div className="form-group">
              <label htmlFor="email">Mobile Number</label>
              <input
                type="text"
                placeholder="Mobile Number"
                className="in_T"
                disabled
              />
            </div>
          </Col>
        </>
      )}
    </>
  );
}

export default Billing_details;
