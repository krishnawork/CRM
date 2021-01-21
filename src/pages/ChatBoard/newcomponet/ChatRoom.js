import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import firebase from "../../../firebase";
import SendMessaj from "./SendMessaj";
import { useDispatch } from "react-redux";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  paper1: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
    fontWeight: "Bold",
    backgroundColor: "#7b1fa2",
  },
  paper2: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
    fontWeight: "Bold",
    backgroundColor: "#689f38",
    overflowWrap: "break-word",
  },
  main_container: {
    padding: "10px",
    height: "83vh",
    // border: "2px solid black",
    overflow: "auto",
  },
  type_container: {
    position: "absolute",
    bottom: "1px",
    left: "10px",
  },
  type_message: {
    width: "100%",
  },
  sendbtn: {
    height: "100%",
  },
}));

function ChatRoom({ id }) {
  const classes = useStyles();
  const [Chat_text, setChat_text] = useState([]);
  const [page, setpage] = useState(null);

  useEffect(() => {
    db.collection("web_user")
      .doc(id)
      .collection("ChatRoom")
      .doc("krushnkantv1@gmail.com")
      .set({ StartChat: "stop" })
      .then((result) => {
        if (result) {
          db.collection("web_user")
            .doc(localStorage.getItem("email"))
            .collection("ChatRoom")
            .doc(id)
            .onSnapshot((result) => {
              if (result.data().StartChat === "stop") {
                setpage(null);
              } else if (result.data().StartChat === "start") {
                setpage(<SendMessaj id={id} />);
              }
            });
        }
      });
  }, [id]);

  useEffect(() => {
    var messageBody = document.querySelector("#messageBody");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  });
  useEffect(() => {
    db.collection("web_user")
      .doc(id)
      .collection("ChatRoom")
      .doc("krushnkantv1@gmail.com")
      .collection("Chat_Store")
      .orderBy("TimeNow")
      .onSnapshot((result) => {
        setChat_text([]);
        if (!result.empty) {
          result.forEach((d) => {
            setChat_text((old) => [...old, d.data()]);
          });
        } else {
          setChat_text([{ Chat_Text: "please Stat Chat" }]);
        }
      });
  }, [id]);

  return (
    <div>
      <div className={classes.main_container} id="messageBody">
        {Chat_text.length > 0
          ? Chat_text.map((d, index) => {
              if (d.Email == localStorage.getItem("email")) {
                return (
                  <div key={index}>
                    <div
                      style={{
                        marginBottom: "7px",
                        textAlign: "right",
                      }}
                    >
                      <Paper
                        style={{
                          display: "inline-block",
                          maxWidth: "70%",
                          marginRight: "10px",
                        }}
                        className={classes.paper1}
                      >
                        {d.Chat_Text}
                      </Paper>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <div
                      style={{
                        marginBottom: "7px",
                        textAlign: "left",
                      }}
                    >
                      <Paper
                        className={classes.paper2}
                        style={{
                          display: "inline-block",
                          maxWidth: "70%",
                          marginLeft: "10px",
                        }}
                      >
                        {d.Chat_Text}
                      </Paper>
                    </div>
                  </div>
                );
              }
            })
          : "Loading..."}
      </div>
      {page}
    </div>
  );
}

export default ChatRoom;
