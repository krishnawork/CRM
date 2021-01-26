/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import firebase from "../../../firebase";
import SendMessaj from "./SendMessaj";
import { useDispatch } from "react-redux";
import GetAppIcon from "@material-ui/icons/GetApp";
import DownloadLink from "react-download-link";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
  },
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
  img: {
    maxWidth: "40%",
  },
}));

function ChatRoom({ id }) {
  const classes = useStyles();
  const [Chat_text, setChat_text] = useState([]);
  const [page, setpage] = useState(<SendMessaj id={id} />);

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
          setChat_text([{ Chat_Text: "Please Start Chat" }]);
        }
      });
  }, [id]);

  return (
    <div>
      <div className={classes.main_container}>
        <div id="messageBody" style={{ height: "80vh", overflow: "auto" }}>
          {Chat_text.length > 0
            ? Chat_text.map((d, index) => {
                if (d.Email === "krushnkantv1@gmail.com") {
                  return (
                    <div key={index}>
                      <div
                        style={{
                          marginBottom: "7px",
                          textAlign: "right",
                        }}
                      >
                        {d.Chat_Text ? (
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
                        ) : (
                          ""
                        )}
                        {/*  */}
                        {d.ImageFile ? (
                          <Paper
                            style={{
                              display: "inline-block",
                              maxWidth: "70%",
                              marginRight: "10px",
                            }}
                            className={classes.paper}
                          >
                            <img
                              className={classes.img}
                              src={d.ImageFile}
                              alt="no image"
                            />
                          </Paper>
                        ) : (
                          ""
                        )}
                        {/*  */}
                        {d.OtherFile ? (
                          <Paper
                            style={{
                              display: "inline-block",
                              maxWidth: "70%",
                              marginRight: "10px",
                            }}
                            className={classes.paper}
                          >
                            <a target="_blank" href={d.OtherFile}>
                              {d.fileName} {<GetAppIcon />}
                            </a>
                          </Paper>
                        ) : (
                          ""
                        )}
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
                        {d.Chat_Text ? (
                          <Paper
                            style={{
                              display: "inline-block",
                              maxWidth: "70%",
                              marginLeft: "10px",
                            }}
                            className={classes.paper2}
                          >
                            {d.Chat_Text}
                          </Paper>
                        ) : (
                          ""
                        )}
                        {/*  */}
                        {d.ImageFile ? (
                          <Paper
                            style={{
                              display: "inline-block",
                              maxWidth: "70%",
                              marginLeft: "10px",
                            }}
                            className={classes.paper}
                          >
                            <img
                              className={classes.img}
                              src={d.ImageFile}
                              alt="no image"
                            />
                          </Paper>
                        ) : (
                          ""
                        )}
                        {/*  */}
                        {d.OtherFile ? (
                          <Paper
                            style={{
                              display: "inline-block",
                              maxWidth: "70%",
                              marginLeft: "10px",
                            }}
                            className={classes.paper}
                          >
                            <a target="_blank" href={d.OtherFile}>
                              {d.fileName} {<GetAppIcon />}
                            </a>
                          </Paper>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                }
              })
            : "Loading..."}
        </div>
      </div>
      <div>{page}</div>
    </div>
  );
}

export default ChatRoom;
