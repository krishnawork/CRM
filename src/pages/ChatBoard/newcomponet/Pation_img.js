import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import firebase from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  Chat_start,
  Chat_seassion,
  AddServiceType,
  Selectservice,
} from "../action/Action";
import { Repeat } from "@material-ui/icons";
let sec = 0;
let min = 0;
let hour = 0;
let stopinterval;
let db = firebase.firestore();
function Pation_img({ id }) {
  let dispatch = useDispatch();
  const Select_Servicetype = useSelector((state) => state.Select_Servicetype);
  const Select_Service = useSelector((state) => state.Select_Service);
  const ChatSession = useSelector((state) => state.ChatSession);
  const Chat = useSelector((state) => state.Chat);
  const timerstop = useSelector((state) => state.ChatSession);
  const [pation, setpation] = useState();
  const [h, seth] = useState(0);
  const [m, setm] = useState(0);
  const [s, sets] = useState(0);

  function startTimer() {
    stopinterval = setInterval(() => {
      if (sec >= 60) {
        sec = 1;
        min++;
        sets(0);
        setm(min);
      } else {
        sets(sec++);
      }
      if (min >= 59) {
        min = 0;
        hour++;
        setm(min);
        seth(hour);
      }
    }, 1000);
  }

  let stop = () => {
    clearInterval(stopinterval);
    sec = 0;
    min = 0;
  };
  useEffect(() => {
    console.log(m);
    // console.log(s);
  }, [s]);
  useEffect(() => {
    if (id) {
      db.collection("web_user")
        .doc(id)
        .get()
        .then((result) => {
          if (result) {
            setpation(result.data());
          }
        });
    }
    return () => {};
  }, [id]);

  useEffect(() => {
    if (ChatSession === null) {
      stop();
    }
  }, [timerstop]);

  useEffect(() => {
    db.collection("web_user")
      .doc(id)
      .collection("ChatRoom")
      .where("Docter_email", "==", "krushnkantv1@gmail.com")
      .limit(1)
      .onSnapshot((result) => {
        if (!result.empty) {
          result.forEach((d) => {
            dispatch(Chat_start(d.data().StartChat));
            console.log("result_Data", d.data());
          });
        } else {
          db.collection("web_user")
            .doc(id)
            .collection("ChatRoom")
            .doc("krushnkantv1@gmail.com")
            .set({
              StartChat: "start",
              Docter_email: "krushnkantv1@gmail.com",
            });
        }
      });
  }, [id, dispatch]);
  let start = () => {
    let seassion;
    if (Select_Servicetype === null && Select_Service === null) {
      if (Chat === "start") {
        db.collection("web_user")
          .doc(id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .set({ StartChat: "stop" }, { merge: true });
        dispatch(Chat_seassion("start"));
        startTimer();
      } else if (Chat === "stop") {
        db.collection("web_user")
          .doc(id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .set({ StartChat: "start" }, { merge: true });
        dispatch(Chat_seassion(null));
        dispatch(AddServiceType(null));
        dispatch(Selectservice(null));
        dispatch(Chat_start(null));
        stop();
      }
    } else if (Select_Servicetype && Select_Service) {
      if (Chat === "start") {
        db.collection("web_user")
          .doc(id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .set({ StartChat: "stop" }, { merge: true });
        dispatch(Chat_seassion("start"));
        startTimer();
        //
        //
      } else if (Chat === "stop") {
        db.collection("web_user")
          .doc(id)
          .collection(Select_Servicetype)
          .doc(Select_Service)
          .get()
          .then((result) => {
            let x = new Date().toISOString().slice(0, 10);
            if (result.data().service_type) {
              db.collection("web_user").doc(id).collection("Histry").add({
                TimeNow: x,
                service_name: result.data().service_name,
                seassion: 1,
                service_type: result.data().service_type,
              });
            } else {
              db.collection("web_user").doc(id).collection("Histry").add({
                TimeNow: x,
                service_name: result.data().service_name,
                seassion: 1,
                // service_type: result.data().service_type,
              });
            }
            //

            if (result.data().seassion > 1) {
              seassion = result.data().seassion;

              db.collection("web_user")
                .doc(id)
                .collection(Select_Servicetype)
                .doc(Select_Service)
                .update({
                  seassion: seassion - 1,
                });
            } else {
              db.collection("web_user")
                .doc(id)
                .collection(Select_Servicetype)
                .doc(Select_Service)
                .delete();
            }
          });

        db.collection("web_user")
          .doc(id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .set({ StartChat: "start" }, { merge: true });
        dispatch(Chat_seassion(null));
        dispatch(AddServiceType(null));
        dispatch(Selectservice(null));
        dispatch(Chat_start(null));
        stop();
      }
    }
  };

  return (
    <>
      {pation ? (
        <h6>
          <Avatar
            alt={pation.fname}
            src="/static/images/avatar/1.jpg"
            style={{ marginRight: "10px", marginTop: "5px" }}
          />
        </h6>
      ) : (
        ""
      )}
      {pation ? (
        <h6 style={{ fontWeight: "bold" }}>{`${
          pation.fname ? pation.fname : ""
        } ${pation.lname ? pation.lname : ""}`}</h6>
      ) : (
        ""
      )}

      <h6>
        <Button
          style={{ position: "absolute", right: "10px", top: "5px" }}
          variant="contained"
          color="primary"
          onClick={start}
        >
          {Chat}
        </Button>
      </h6>
      <h6>
        <Button
          style={{ position: "absolute", right: "100px", top: "5px" }}
          variant="contained"
          color="primary"
        >
          {`${h}:${m}:${s}`}
        </Button>
      </h6>
    </>
  );
}

export default Pation_img;
