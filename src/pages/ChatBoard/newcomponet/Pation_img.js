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

let db = firebase.firestore();
function Pation_img({ id }) {
  let dispatch = useDispatch();
  const Select_Servicetype = useSelector((state) => state.Select_Servicetype);
  const Select_Service = useSelector((state) => state.Select_Service);
  const Chat = useSelector((state) => state.Chat);
  const [pation, setpation] = useState();
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
      alert("Please Select Product");
    } else if (Select_Servicetype && Select_Service) {
      if (Chat === "start") {
        db.collection("web_user")
          .doc(id)
          .collection("ChatRoom")
          .doc("krushnkantv1@gmail.com")
          .set({ StartChat: "stop" }, { merge: true });
        dispatch(Chat_seassion("start"));
      } else if (Chat === "stop") {
        db.collection("web_user")
          .doc(id)
          .collection(Select_Servicetype)
          .doc(Select_Service)
          .get()
          .then((result) => {
            console.log("sdsdsdsdsdsdsdsdsd", result.data());
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
    </>
  );
}

export default Pation_img;
