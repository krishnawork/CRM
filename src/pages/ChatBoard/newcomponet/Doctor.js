import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import Paper from "@material-ui/core/Paper";

import firebase from "../../../firebase";
import "./Doctor.css";
let db = firebase.firestore();
//
const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
    backgroundColor: theme.palette.background.paper,
    cursor: "pointer",
  },
  paper: {
    textAlign: "center",
    backgroundColor: "#ecf4fd",
  },
  hover: {
    backgroundColor: "red",
  },
}));
//
function Doctor({ setdocter_name }) {
  const classes = useStyles();
  const [doctor, setdoctor] = useState([]);
  useEffect(() => {
    db.collection("Main_user")
      .get()
      .then((result) => {
        if (result) {
          result.forEach((data) => {
            setdoctor((old) => [...old, data.data()]);
          });
        }
      });
  }, [setdocter_name]);
  let showdocter_chat = (docter_name) => {
    if (docter_name) {
      setdocter_name(docter_name);
    }
  };
  return (
    <div>
      {doctor.length > 0
        ? doctor.map((d, index) => {
            return (
              <Paper key={index} className="abhikeliye">
                <List hover="true" onClick={() => showdocter_chat(d.User)}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={d.User} src={d.User_Img} />
                    </ListItemAvatar>
                    <ListItemText primary={d.User_Name} />
                  </ListItem>
                </List>
              </Paper>
            );
          })
        : "...Loading"}
    </div>
  );
}

export default Doctor;
