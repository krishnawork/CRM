import React, { useState, useEffect } from "react";
import s from "./Dashboard.module.scss";
import { Row, Col } from "reactstrap";
import Widget from "../../components/Widget/Widget";
import firebase from "../../firebase";
import TestCount from "./TestCount";

let db = firebase.firestore();

// table value

//

function Dashboard() {
  const [totalservice, settotalservice] = useState(0);
  const [totalprogram, settotalprogram] = useState(0);
  const [totalpaidtest, settotalpaidtest] = useState(0);
  const [toptest, settoptest] = useState([]);

  useEffect(() => {
    db.collection("AllDate")
      .doc(new Date().toISOString().slice(0, 10))
      .collection("service")
      .onSnapshot((result) => {
        if (!result.empty) {
          settotalservice(result.size);
        }
      });
    //
    db.collection("AllDate")
      .doc(new Date().toISOString().slice(0, 10))
      .collection("Programs")
      .onSnapshot((result) => {
        if (!result.empty) {
          settotalprogram(result.size);
        }
      });
    //
    db.collection("AllDate")
      .doc(new Date().toISOString().slice(0, 10))
      .collection("paid-test")
      .onSnapshot((result) => {
        if (!result.empty) {
          settotalpaidtest(result.size);
          result.forEach((data) => {
            settoptest((old) => [...old, data.data()]);
          });
        }
      });
    //
  }, []);

  return (
    <div className={s.root}>
      <Row>
        <Col xl={4}>
          <Widget
            title={
              <p style={{ fontWeight: 700, textAlign: "center" }}>
                Today's Service Purchased
              </p>
            }
          >
            <Row className={`justify-content-between mt-3`} noGutters>
              <Col style={{ textAlign: "center" }} sm={12}>
                <h3 className={"fw-semi-bold mb-0"}>{totalservice}</h3>
              </Col>
            </Row>
          </Widget>
        </Col>
        {/*  */}
        <Col xl={4}>
          <Widget
            title={
              <p style={{ fontWeight: 700, textAlign: "center" }}>
                Today's Program Purchased
              </p>
            }
          >
            <Row className={`justify-content-between mt-3`} noGutters>
              <Col style={{ textAlign: "center" }} sm={12}>
                <h3 className={"fw-semi-bold mb-0"}>{totalprogram}</h3>
              </Col>
            </Row>
          </Widget>
        </Col>
        {/*  */}
        <Col xl={4}>
          <Widget
            title={
              <p style={{ fontWeight: 700, textAlign: "center" }}>
                Today's Test Purchased
              </p>
            }
          >
            <Row className={`justify-content-between mt-3`} noGutters>
              <Col style={{ textAlign: "center" }} sm={12}>
                <h3 className={"fw-semi-bold mb-0"}>{totalpaidtest}</h3>
              </Col>
            </Row>
          </Widget>
        </Col>
      </Row>
      {/*  */}

      <Row>
        <TestCount toptest={toptest} />
      </Row>
    </div>
  );
}

export default Dashboard;
