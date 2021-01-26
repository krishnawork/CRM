/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../../firebase";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
//
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DirectionsIcon from "@material-ui/icons/Directions";
//
import "./SendMessaj.css";
let db = firebase.firestore();
let store = firebase.storage();

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    direction: "row",
    width: 400,
    marginLeft: "20%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },

  type_message: {},
  sendbtn: {
    height: "100%",
  },
  emojibtn: {
    height: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function SendMessaj({ id }) {
  const classes = useStyles();
  const [text, settext] = useState("");
  const [showemoji, setshowemoji] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  function Send() {
    setshowemoji(false);
    let Msg = document.querySelector("#your-msg").value;
    let intery = Msg.replace(/ /g, "");
    if (intery.length > 0) {
      db.collection("web_user")
        .doc(id)
        .collection("ChatRoom")
        .doc("krushnkantv1@gmail.com")
        .collection("Chat_Store")
        .add({
          TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
          Email: "krushnkantv1@gmail.com",
          Chat_Text: Msg,
        })
        .then(() => {
          document.querySelector("#your-msg").value = null;
          settext("");
          //   done++;
        });
    }
  }

  let handleChange = (e) => {
    settext(e.target.value);
    setshowemoji(false);
  };

  let addEmoji = (e) => {
    let emoji = e.native;
    settext(text + emoji);
  };

  let Showemoji = () => {
    setshowemoji(!showemoji);
  };
  let Showfileselect = () => {
    document.querySelector("#fileLoader").click();
  };
  // let filedetails = async (e) => {
  //   const file = e.target.files[0];
  //   const storageRef = store.ref(`/Chat_Image/${id}`);
  //   const fileRef = storageRef.child(file.name);
  //   await fileRef.put(file);
  //   // setFileUrl(await fileRef.getDownloadURL());
  //   alert(file);
  //   // db.collection("web_user")
  //   //   .doc(id)
  //   //   .collection("ChatRoom")
  //   //   .doc("krushnkantv1@gmail.com")
  //   //   .collection("Chat_Store")
  //   //   .add({
  //   //     TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
  //   //     Email: "krushnkantv1@gmail.com",
  //   //     File: await fileRef.getDownloadURL(),
  //   //   })
  //   //   .then((r) => {});
  // };

  let filedetails = async (e) => {
    setOpen(true);
    const file = e.target.files[0];
    const storageRef = store.ref(`/Chat_Image/${id}`);
    const fileRef = storageRef.child(file.name);

    // setFileUrl(await fileRef.getDownloadURL());
    console.log(file);
    if (
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png"
    ) {
      await fileRef.put(file);
      db.collection("web_user")
        .doc(id)
        .collection("ChatRoom")
        .doc("krushnkantv1@gmail.com")
        .collection("Chat_Store")
        .add({
          TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
          Email: "krushnkantv1@gmail.com",
          ImageFile: await fileRef.getDownloadURL(),
        })
        .then((r) => {
          setOpen(false);
        });
    } else if (file.type === "application/pdf") {
      await fileRef.put(file);
      db.collection("web_user")
        .doc(id)
        .collection("ChatRoom")
        .doc("krushnkantv1@gmail.com")
        .collection("Chat_Store")
        .add({
          TimeNow: firebase.firestore.FieldValue.serverTimestamp(),
          Email: "krushnkantv1@gmail.com",
          OtherFile: await fileRef.getDownloadURL(),
          fileName: file.name,
        })
        .then((r) => {
          setOpen(false);
        });
    } else {
      alert("This File Not Support");
      setOpen(false);
    }
  };

  return (
    <div>
      {/*  */}
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper component="form" className={classes.root}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <AttachFileIcon onClick={Showfileselect} />
          <InputBase
            type="file"
            id="fileLoader"
            name="files"
            title="Load File"
            onChange={filedetails}
          />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Type Your Message"
          id="your-msg"
          value={text}
          onChange={handleChange}
          type="text"
          variant="outlined"
          // className={classes.type_message}
          autoComplete="off"
        />
        <IconButton>
          {showemoji ? (
            <div style={{ position: "absolute", bottom: "70px" }}>
              <span>
                <Picker onSelect={addEmoji} />
              </span>
            </div>
          ) : (
            ""
          )}
          <EmojiEmotionsIcon onClick={Showemoji} />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            Send();
          }}
          type="submit"
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
        >
          <DirectionsIcon />
        </IconButton>
      </Paper>
      {/*  */}
    </div>
  );
}

export default SendMessaj;
