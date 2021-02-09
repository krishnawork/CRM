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
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import firebase from "../../firebase";
import Orderdetails from "./Order_details";
import Patient from "../patient/Patient2";
import Billingdetails from "./Billing_details";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { useSelector, useDispatch } from "react-redux";
import { getid, incress } from "./Get_id";
import Swal from "sweetalert2";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "../pagination/Pagination";

let db = firebase.firestore();

//
const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

//
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  margin: {
    margin: theme.spacing(1),
  },
  backdrop: {
    color: "#fff",
  },
}));
//
const emails = ["username@gmail.com", "user02@gmail.com"];

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Create New Bill</DialogTitle>
      <List>
        <h1>helo</h1>

        <ListItem
          autoFocus
          button
          onClick={() => handleListItemClick("addAccount")}
        ></ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function Billing() {
  //
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openb, setOpenb] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [orderdata, setorderdata] = useState([]);
  const [modal, setmodal] = useState(false);
  const [web_user, setweb_user] = useState([]);
  const [patient_email, setpatient_email] = useState(null);
  const [payment, setpayment] = useState(null);
  const [searchpatient, setsearchpatient] = useState("");
  const servceamount = useSelector((state) => state.servceamount);
  const programamount = useSelector((state) => state.programamount);
  const paidamamount = useSelector((state) => state.paidamamount);
  const servicename = useSelector((state) => state.servicename);
  const serviceproductname = useSelector((state) => state.serviceproductname);
  const servicesession = useSelector((state) => state.servicesession);
  const programname = useSelector((state) => state.programname);
  const paidtestname = useSelector((state) => state.paidtestname);
  const [searchDataValue, setsearchDataValue] = useState([]);
  const [Loading, setLoading] = useState("");
  const fname = useSelector((state) => state.fname);
  const lname = useSelector((state) => state.lname);

  const mnumber = useSelector((state) => state.mnumber);
  const [totallength, settotallength] = useState(0);
  const [showPerPage, setShowPerPage] = useState(5);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  useEffect(() => {
    db.collection("All_order")
      .orderBy("TimeNow", "desc")
      .onSnapshot((result) => {
        if (!result.empty) {
          settotallength(result.size);
          result.forEach((data) => {
            setorderdata((old) => [...old, data.data()]);
          });
        }
      });
  }, []);

  //
  let toggle = () => {
    setmodal(!modal);
    console.log(web_user);
  };
  //
  useEffect(() => {
    db.collection("web_user").onSnapshot((res) => {
      if (!res.empty) {
        res.forEach((data) => {
          setweb_user((old) => [...old, data]);
        });
      }
    });
  }, []);
  //
  let submitbill = () => {
    setOpenb(true);
    if ((patient_email && servicename) || programname || paidtestname) {
      if (servicename) {
        db.collection("AllDate")
          .doc(new Date().toISOString().slice(0, 10))
          .collection("service")
          .add({
            date: new Date().toISOString().slice(0, 10),
            service_name: servicename,
            service_type: serviceproductname,
            seassion: servicesession,
            amount: servceamount,
            userID: `${patient_email ? patient_email : "fname"}`,
          });
      }
      if (programname) {
        db.collection("AllDate")
          .doc(new Date().toISOString().slice(0, 10))
          .collection("Programs")
          .add({
            date: new Date().toISOString().slice(0, 10),
            service_name: programname,
            amount: programamount,
            session: 4,
            userID: `${patient_email ? patient_email : "fname"}`,
          });
      }

      if (paidtestname) {
        db.collection("AllDate")
          .doc(new Date().toISOString().slice(0, 10))
          .collection("paid-test")
          .add({
            test_name: paidtestname,
            amount: paidamamount,
            date: new Date().toISOString().slice(0, 10),
            userID: `${patient_email ? patient_email : "fname"}`,
          });
      }

      db.collection("All_order")
        .doc(patient_email)
        .set(
          {
            fname: fname,
            lname: lname,
            number: mnumber,
            email: `${patient_email ? patient_email : "fname"}`,
            offline: "offline",
            TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .then((d) => {
          getid("fild1").then((result) => {
            db.collection("All_order")
              .doc(patient_email)
              .collection("Offline")
              .add({
                BillNo: result,
                Date: new Date().toISOString().slice(0, 10),
                userID: patient_email,
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
                  Number(servceamount) +
                  Number(programamount) +
                  Number(paidamamount),
                payAmount: Number(payment),
                pandingAmount:
                  Number(servceamount) +
                  Number(programamount) +
                  Number(paidamamount) -
                  Number(payment),
              })
              .then((res) => {
                db.collection("web_user")
                  .doc(patient_email)
                  .collection("offline_order")
                  .add({
                    BillNo: result,
                    Date: new Date().toISOString().slice(0, 10),
                    userID: patient_email,
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
                      Number(servceamount) +
                      Number(programamount) +
                      Number(paidamamount),
                  })
                  .then((r) => {
                    incress("fild1", result);
                    setOpenb(false);
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
              });
          });
        });
    } else {
      alert("Please Fill Form");
    }
  };
  //
  useEffect(() => {
    if (searchpatient) {
      setsearchDataValue([]);
      orderdata.map((d) => {
        if (d.email.match(searchpatient)) {
          setsearchDataValue((old) => [
            ...old,
            { email: d.email, fname: d.fname, lname: d.lname },
          ]);
        }
      });
    }
  }, [searchpatient]);
  //
  return (
    <>
      <Backdrop className={classes.backdrop} open={openb}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Row>
        <Col xl={4} style={{ paddingBottom: "10px" }}>
          <Button color="primary" onClick={toggle}>
            Create
          </Button>{" "}
        </Col>
        <Col xl={2} style={{ paddingBottom: "10px" }}>
          <p></p>
        </Col>
        <Col xl={6} style={{ paddingBottom: "10px" }}>
          <input
            type="text"
            list="patient"
            placeholder="Search"
            className="changeborder"
            style={{
              height: "40px",
              width: "100%",
              border: "1px solid gray",
              padding: "10px",
              borderRadius: "20px",
            }}
            onChange={(event) => setsearchpatient(event.target.value)}
          />
        </Col>
      </Row>
      {/*  */}

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Creat New Bill</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6}>
              <div className="form-group">
                <label htmlFor="email">Please Select Email Address</label>
                <input
                  type="text"
                  list="patient"
                  style={{
                    height: "40px",
                    width: "100%",
                    border: "1px solid gray",
                  }}
                  onChange={(event) => setpatient_email(event.target.value)}
                />
                <datalist id="patient">
                  {web_user.length > 0
                    ? web_user.map((d) => {
                        return (
                          <option value={d.data().email}>
                            {d.data().email}
                          </option>
                        );
                      })
                    : "loading.."}
                </datalist>
              </div>
            </Col>
            <Billingdetails id={patient_email} />
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
                  Create Bill
                </Button>
              </div>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
      {/*  */}

      {/* <SimpleDialog open={open} onClose={handleClose} /> */}
      {/*  */}
      {searchpatient === "" ? (
        <>
          <div className={classes.root}>
            {orderdata
              .slice(pagination.start, pagination.end)
              .map((d, index) => {
                return (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        <List>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                alt={d.email}
                                src="/static/images/avatar/1.jpg"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${d.fname ? d.fname : ""} ${
                                d.lname ? d.lname : ""
                              }`}
                            />
                          </ListItem>
                        </List>
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {/* {d.email} */}
                        <List>
                          <ListItem style={{ marginTop: "5px" }}>
                            <ListItemText primary={d.email} />
                          </ListItem>
                        </List>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Orderdetails email={d.email} />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
          {totallength > 0 ? (
            <Pagination
              showPerPage={showPerPage}
              onPaginationChange={onPaginationChange}
              total={totallength}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        searchDataValue.map((d, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          alt={d.email}
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${d.fname ? d.fname : ""} ${
                          d.lname ? d.lname : ""
                        }`}
                      />
                    </ListItem>
                  </List>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {/* {d.email} */}
                  <List>
                    <ListItem style={{ marginTop: "5px" }}>
                      <ListItemText primary={d.email} />
                    </ListItem>
                  </List>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Orderdetails email={d.email} />
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </>
  );
}
