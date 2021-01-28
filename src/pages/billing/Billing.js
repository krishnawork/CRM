import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import firebase from "../../firebase";
import Order_details from "./Order_details";

// import Message from "./Message";
let db = firebase.firestore();

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
}));
//
function Billing() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [orderdata, setorderdata] = useState([]);
  const [Loading, setLoading] = useState("Loading");
  useEffect(() => {
    db.collection("All_order")
      .get()
      .then((result) => {
        if (!result.empty) {
          result.forEach((data) => {
            setorderdata((old) => [...old, data.data()]);
          });
        }
      });
  }, []);

  return (
    <div>
      <div className={classes.root}>
        {orderdata.length > 0
          ? orderdata.map((d, index) => {
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
                      {d.email}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Order_details email={d.email} />
                  </AccordionDetails>
                </Accordion>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default Billing;
