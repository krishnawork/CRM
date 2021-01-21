import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../../firebase";
let db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    height: "80vh",
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

function SendMessaj({ id }) {
  const classes = useStyles();

  function Send() {
    let Msg = document.querySelector("#your-msg").value;
    let intery = Msg.replace(/ /g, "");
    if (intery.length > 0) {
      db.collection("web_user")
        .doc(localStorage.getItem("email"))
        .collection("ChatRoom")
        .doc(id)
        .collection("Chat_Store")
        .add({
          TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
          Email: localStorage.getItem("email"),
          Chat_Text: Msg,
        })
        .then(() => {
          document.querySelector("#your-msg").value = null;

          //   done++;
        });
    }
  }
  return (
    <div>
      <form>
        <Grid container item sm={12} className={classes.type_container}>
          <Grid item sm={10}>
            <TextField
              id="your-msg"
              label="Type Your Message"
              type="text"
              variant="outlined"
              className={classes.type_message}
              autoComplete="off"
            />
          </Grid>
          <Grid item sm={2}>
            <button
              variant="contained"
              color="primary"
              value="submit"
              className={classes.sendbtn}
              onClick={(e) => {
                e.preventDefault();
                Send();
              }}
            >
              Send
            </button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default SendMessaj;
