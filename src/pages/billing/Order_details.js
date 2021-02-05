import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
} from "reactstrap";
import firebase from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FileSaver from "file-saver";
import generatePDF from "../../reportGenerator";
import { useSelector, useDispatch } from "react-redux";
import Billing_details_Edit from "./Billing_details_Edit";
import Swal from "sweetalert2";
import {
  AddServiceAmount,
  AddServiceName,
  AddServiceProductName,
  AddServiceSession,
  AddProgramName,
  AddPaidTestName,
  updatebillid,
} from "./action/Action";

let db = firebase.firestore();
let store = firebase.storage();
//
const useStyles = makeStyles((theme) => ({}));
//

function Paid_test_details({ email }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [Loadind, setLoadind] = useState("Loading");
  const [selfdata, setselfdata] = useState([]);
  const [offlineselfdata, setofflineselfdata] = useState([]);
  const [modal, setmodal] = useState(false);
  const [patient_email, setpatient_email] = useState(null);
  const [payment, setpayment] = useState(null);
  const servceamount = useSelector((state) => state.servceamount);
  const programamount = useSelector((state) => state.programamount);
  const paidamamount = useSelector((state) => state.paidamamount);
  const servicename = useSelector((state) => state.servicename);
  const serviceproductname = useSelector((state) => state.serviceproductname);
  const servicesession = useSelector((state) => state.servicesession);
  const programname = useSelector((state) => state.programname);
  const paidtestname = useSelector((state) => state.paidtestname);
  const updatebill_id = useSelector((state) => state.updatebillid);
  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("All_order")
        .doc(email)
        .collection("order")
        .orderBy("BillNo", "desc")
        .onSnapshot((result) => {
          setselfdata([]);
          if (!result.empty) {
            result.forEach((d) => {
              setselfdata((old) => [...old, d]);
            });
          } else {
            setLoadind("Data Not Available");
          }
        });
    }
    return () => {
      setLoadind("Loading");
    };
  }, [email]);

  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("All_order")
        .doc(email)
        .collection("Offline")
        .orderBy("BillNo", "desc")
        .onSnapshot((result) => {
          setofflineselfdata([]);
          if (!result.empty) {
            result.forEach((d) => {
              setofflineselfdata((old) => [...old, d]);
            });
          } else {
          }
        });
    }
    return () => {
      setLoadind("Loading");
    };
  }, [email]);
  let toggle = () => {
    setmodal(!modal);
  };
  let EditBill = (id) => {
    setmodal(!modal);
    dispatch(updatebillid(id));
    // dispatch(updatebillemail(email));
    // dispatch(editbill(true));

    db.collection("All_order")
      .doc(email)
      .collection("Offline")
      .doc(id)
      .get()
      .then((result) => {
        if (result.exists) {
          dispatch(AddServiceName(result.data().servicename));
          dispatch(AddServiceProductName(result.data().serviceproductname));
          dispatch(AddServiceSession(result.data().servicesession));
          dispatch(AddServiceAmount(result.data().servceamount));
          dispatch(AddProgramName(result.data().programname));
          dispatch(AddPaidTestName(result.data().paidtestname));
          setpayment(result.data().payAmount);
        }
      });
  };
  //
  let DeleteBill = (id) => {
    if (window.confirm("Delete the item?")) {
      db.collection("All_order")
        .doc(email)
        .collection("Offline")
        .doc(id)
        .delete()
        .then((result) => {
          Swal.fire({
            icon: "success",
            type: "success",
            text: "Delete successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        });
    }
  };

  //
  let submitbill = () => {
    db.collection("All_order")
      .doc(email)
      .collection("Offline")
      .doc(updatebill_id)
      .update({
        servicename: servicename,
        serviceproductname: serviceproductname,
        servicesession: servicesession,
        servceamount: servceamount,
        programname: programname,
        programsession: 4,
        programamount: programamount,
        paidtestname: paidtestname,
        paidamamount: paidamamount,
        TotalAmoutn:
          Number(servceamount) + Number(programamount) + Number(paidamamount),
        payAmount: Number(payment),
        pandingAmount:
          Number(servceamount) +
          Number(programamount) +
          Number(paidamamount) -
          Number(payment),
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          type: "success",
          text: "Update successfully!",
          showConfirmButton: true,
          timer: 3500,
        }).then(() => {
          setmodal(false);
        });
      });
  };

  return (
    <div>
      {/* Modal */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Creat New Bill</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6}>
              <div className="form-group">
                <label htmlFor="email">Patient Email Address</label>
                <input
                  type="text"
                  list="patient"
                  style={{
                    height: "40px",
                    width: "100%",
                    border: "1px solid gray",
                  }}
                  value={email}
                />
              </div>
            </Col>
            <Billing_details_Edit id={email} />
          </Row>
        </ModalBody>
        <ModalFooter>
          <Row>
            <Col xl={6}>
              <div className="form-group">
                <label htmlFor="email">Total Amount</label>
                <input
                  className="form-control"
                  value={
                    Number(servceamount) +
                    Number(programamount) +
                    Number(paidamamount)
                  }
                  disabled
                />
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group">
                <label htmlFor="email">Pay Amount</label>
                <input
                  className="form-control"
                  type="number"
                  value={payment}
                  onChange={(event) => setpayment(event.target.value)}
                />
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group">
                <Button
                  style={{ marginTop: "30px" }}
                  color="primary"
                  onClick={submitbill}
                >
                  Edit Bill
                </Button>
              </div>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
      {/* Modal */}
      <div>
        {selfdata.length > 0
          ? selfdata.map((d, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    width: " 400px",

                    margin: "10px",
                  }}
                >
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        BillNo : {d.data().BillNo}
                      </Typography>

                      <Typography
                        variant="h5"
                        component="h2"
                        style={{ height: "111px" }}
                      >
                        {d.data().service_name ? d.data().service_name : ""}
                        {d.data().test_name ? d.data().test_name : ""}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Type: <br />
                        {d.data().service_type ? d.data().service_type : ""}
                        {d.data().test_type ? d.data().test_type : ""}
                        <br />
                      </Typography>
                      <Typography variant="body2" component="p">
                        Total Amount : {d.data().amount}
                        <br />
                        Recieved Amount : {d.data().amount}
                        <br />
                        pending amount : 0
                      </Typography>
                    </CardContent>
                    <CardActions></CardActions>
                  </Card>
                </div>
              );
            })
          : ""}
        {/*  */}
        {offlineselfdata.length > 0
          ? offlineselfdata.map((d, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    width: " 400px",

                    margin: "10px",
                  }}
                >
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        <div style={{ float: "left" }}>
                          BillNo : {d.data().BillNo}
                          <br />
                          Date : {d.data().Date}
                        </div>
                        <div style={{ float: "right" }}>Offline Bill</div>
                        <div style={{ clear: "both" }}></div>
                      </Typography>

                      <Typography
                        className={classes.pos}
                        color="textSecondary"
                        style={{ height: "100px" }}
                      >
                        {d.data().servicename
                          ? `Service Name:` + d.data().servicename
                          : ""}
                        <br />
                        {d.data().programname
                          ? `Program Name:` + d.data().programname
                          : ""}
                        <br />
                        {d.data().paidtestname
                          ? `PaidTest Name:` + d.data().paidtestname
                          : ""}
                        <br />
                      </Typography>

                      <Typography variant="body2" component="p">
                        Total Amount : {d.data().TotalAmoutn}
                        <br />
                        Recieved Amount : {d.data().payAmount}
                        <br />
                        Pending Amount : {d.data().pandingAmount}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        style={{ width: "100px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          EditBill(d.id);
                        }}
                        color="success"
                      >
                        Edit
                      </Button>
                      <Button
                        style={{ width: "100px" }}
                        onClick={(e) => {
                          e.preventDefault();

                          DeleteBill(d.id);
                        }}
                        color="success"
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              );
            })
          : ""}
        {/*  */}
      </div>
    </div>
  );
}

export default Paid_test_details;
