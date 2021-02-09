import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import InputBase from "@material-ui/core/InputBase";
import firebase from "../../firebase";
import Progress_details from "./Progress_details";
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
//
function Progress() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [user, setuser] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [searchpatient, setsearchpatient] = useState("");
  const [searchDataValue, setsearchDataValue] = useState([]);
  //
  const [totallength, settotallength] = useState(0);
  const [showPerPage, setShowPerPage] = useState(5);
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage,
  });
  const onPaginationChange = (start, end) => {
    setPagination({ start: start, end: end });
  };
  //
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  //
  useEffect(() => {
    db.collection("web_user")
      .get()
      .then((result) => {
        if (!result.empty) {
          settotallength(result.size);
          result.forEach((data) => {
            setuser((old) => [...old, data.data()]);
          });
        }
      });
  }, []);
  //
  useEffect(() => {
    if (searchpatient) {
      setsearchDataValue([]);
      user.map((d) => {
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
    <div>
      <Row>
        <Col xl={4} style={{ paddingBottom: "10px" }}>
          <p></p>
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
      {searchpatient === "" ? (
        <>
          <div>
            {user.length > 0
              ? user.slice(pagination.start, pagination.end).map((d, index) => {
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
                        <Progress_details email={d.email} />
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              : ""}
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
                <Progress_details email={d.email} />
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </div>
  );
}

export default Progress;
