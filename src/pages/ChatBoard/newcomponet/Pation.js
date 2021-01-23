import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  AddEmail,
  AddServiceType,
  Selectservice,
  Chat_seassion,
  Chat_start,
} from "../action/Action";
import firebase from "../../../firebase";
import "./Doctor.css";
let db = firebase.firestore();

function Pation() {
  let dispatch = useDispatch();
  const Select_Servicetype = useSelector((state) => state.Select_Servicetype);
  const Select_Service = useSelector((state) => state.Select_Service);
  const ChatSession = useSelector((state) => state.ChatSession);
  const User_Email_id = useSelector((state) => state.User_Email_id);
  const [pation, setpation] = useState([]);
  useEffect(() => {
    db.collection("web_user")
      .get()
      .then((result) => {
        if (result) {
          result.forEach((data) => {
            setpation((old) => [...old, data.data()]);
          });
        }
      });
  }, []);
  //
  let showpation_details = (pation_name) => {
    if (pation_name && ChatSession === null) {
      dispatch(AddEmail(pation_name));
      dispatch(AddServiceType(null));
      dispatch(Selectservice(null));
    } else {
      let result = window.confirm("Want to conform End Seassion ?");
      if (result) {
        db.collection("web_user")
          .doc(User_Email_id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .update({ StartChat: "start" })
          .then((h) => {
            // dispatch(Chat_seassion(null));
            dispatch(AddServiceType(null));
            dispatch(Selectservice(null));
            dispatch(Chat_start(null));
            dispatch(AddEmail(pation_name));
            dispatch(Chat_seassion(null));
          });
      }
    }
  };
  return (
    <div>
      <div style={{ height: "90vh", overflow: "auto" }}>
        {pation.length > 0
          ? pation.map((d, index) => {
              return (
                <Paper key={index} className="abhikeliye">
                  <List
                    hover="true"
                    onClick={() => showpation_details(d.email)}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        {/* <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        /> */}
                        <Avatar
                          alt={d.fname}
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
                </Paper>
              );
            })
          : "...Loading"}
      </div>
    </div>
  );
}

export default Pation;
