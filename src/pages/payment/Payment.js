import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import Widget from "../../components/Widget/Widget";
import firebase from "../../firebase";
import Order_details from "./Order_details";
import Swal from "sweetalert2";

let db = firebase.firestore();
function Payment() {
  const [user_email, setuser_email] = useState([]);
  const [patient_email, setpatient_email] = useState(null);
  const [setbill, setsetbill] = useState(null);
  const [billdetailsID, setbilldetailsID] = useState(null);
  const [billdetailsTotal, setbilldetailsTotal] = useState(null);
  const [billdetailsPaid, setbilldetailsPaid] = useState(null);
  const [billdetailsPanding, setbilldetailsPanding] = useState(null);
  const [payment, setpayment] = useState(null);

  useEffect(() => {
    db.collection("All_order")
      .where("offline", "==", "offline")
      .get()
      .then((result) => {
        if (!result.empty) {
          result.forEach((data) => {
            setuser_email((old) => [...old, data]);
          });
        }
      });
  }, []);
  useEffect(() => {
    if (patient_email && setbill)
      db.collection("All_order")
        .doc(patient_email)
        .collection("Offline")
        .doc(setbill)
        .get()
        .then((res) => {
          if (res.exists) {
            setbilldetailsID(res.data().BillNo);
            setbilldetailsTotal(res.data().TotalAmoutn);
            setbilldetailsPaid(res.data().payAmount);
            setbilldetailsPanding(res.data().pandingAmount);
          }
        });
  }, [setbill, patient_email]);

  let paymentdone = () => {
    if (!patient_email) {
      alert("Please Select Patient ");
    } else if (!setbill) {
      alert("Please Select BillNo ");
    } else if (!payment) {
      alert("Please Enter Amount");
    } else {
      db.collection("All_order")
        .doc(patient_email)
        .collection("Offline")
        .doc(setbill)
        .update({
          payAmount: Number(billdetailsPaid) + Number(payment),
          pandingAmount: billdetailsPanding - payment,
        })
        .then((res) => {
          Swal.fire({
            icon: "success",
            type: "success",
            text: "Billing successfully!",
            showConfirmButton: true,
            timer: 3500,
          }).then(() => {
            setsetbill(null);
            setbilldetailsID(null);
            setbilldetailsTotal(null);
            setbilldetailsPaid(null);
            setbilldetailsPanding(null);
            setpayment(null);
            document.querySelector("#exampleEmail").value = null;
          });
        });
    }
  };

  return (
    <div>
      <div>
        <ToastContainer />
        <Row>
          <Col xl={12}>
            <Widget title={<p style={{ fontWeight: 700 }}>Payment</p>}>
              <Row>
                <Col xl={12}>
                  <FormGroup>
                    <Label for="exampleSelect">Patients</Label>
                    <input
                      type="text"
                      list="patient"
                      style={{
                        height: "40px",
                        width: "100%",
                        border: "1px solid gray",
                      }}
                      onChange={(event) => {
                        setpatient_email(event.target.value);
                        setsetbill(null);
                        setbilldetailsID(null);
                        setbilldetailsTotal(null);
                        setbilldetailsPaid(null);
                        setbilldetailsPanding(null);
                        setpayment(null);
                        document.querySelector("#exampleEmail").value = null;
                      }}
                    />
                    <datalist style={{ width: "100%" }} id="patient">
                      {user_email.length > 0
                        ? user_email.map((d) => {
                            return <option value={d.id}>{d.id}</option>;
                          })
                        : "loading.."}
                    </datalist>
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleSelect">Bill No.</Label>
                    <Input
                      type="text"
                      value={billdetailsID ? billdetailsID : ""}
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>

              <br />

              <Row>
                <Col xl={12}>
                  <Form
                    inline
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Col xl={2}>
                      <FormGroup>
                        <Label>
                          <h4>Total</h4> {"  :- "}{" "}
                          <h5>{billdetailsTotal ? billdetailsTotal : ""}</h5>
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col xl={2}>
                      <FormGroup>
                        <Label>
                          <h4>Paid</h4> {"  :- "}{" "}
                          <h5>{billdetailsPaid ? billdetailsPaid : ""}</h5>
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col xl={6}>
                      <FormGroup>
                        <Label for="payment" hidden>
                          Pay Pending Amount*
                        </Label>
                        <Input
                          style={{ width: "100%" }}
                          type="number"
                          name="payAmount"
                          id="exampleEmail"
                          placeholder="payment"
                          value={payment}
                          onChange={(e) => setpayment(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col xl={2}>
                      <FormGroup>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            paymentdone();
                          }}
                          color="success"
                        >
                          Pay
                        </Button>
                      </FormGroup>
                    </Col>
                  </Form>
                </Col>
              </Row>
            </Widget>
          </Col>
        </Row>
      </div>
      {/*  */}
      <Order_details email={patient_email} setsetbill={setsetbill} />
    </div>
  );
}

export default Payment;
