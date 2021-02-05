import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import ReactQuill from "react-quill";
import firebase from "../../firebase";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
let db = firebase.firestore();

//
const useStyles = makeStyles((theme) => ({}));
//

function Progress_details({ email }) {
  const classes = useStyles();
  const [modal, setmodal] = useState(false);
  const [description, setdescription] = useState(null);
  const [descdata, setdescdata] = useState([]);
  const [editid, seteditid] = useState(null);
  let toggle = () => {
    seteditid(null);
    setdescription(null);
    setmodal(!modal);
  };

  let onDescChange = (value) => {
    setdescription(value);
  };

  useEffect(() => {
    db.collection("web_user")
      .doc(email)
      .collection("Progress")
      .onSnapshot((result) => {
        setdescdata([]);
        if (!result.empty) {
          result.forEach((data) => {
            setdescdata((old) => [...old, data]);
          });
        }
      });
  }, [email]);
  let submitprogress = () => {
    if (description) {
      db.collection("web_user")
        .doc(email)
        .collection("Progress")
        .add({
          ProgressText: description,
          Date: new Date().toISOString().slice(0, 10),
        })
        .then((result) => {
          setmodal(false);
          setdescription(null);
          Swal.fire({
            icon: "success",
            type: "success",
            text: "Progress Add successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        });
    } else {
      alert("Please Fill Form");
    }
  };
  let updateprogress = () => {
    if (description) {
      db.collection("web_user")
        .doc(email)
        .collection("Progress")
        .doc(editid)
        .update({
          ProgressText: description,
        })
        .then((result) => {
          setmodal(false);
          setdescription(null);
          Swal.fire({
            icon: "success",
            type: "success",
            text: "Progress Update successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        });
    } else {
      alert("Please Fill Form");
    }
  };

  let Editprogress = (id) => {
    if (id) {
      setmodal(!modal);
      seteditid(id);
      db.collection("web_user")
        .doc(email)
        .collection("Progress")
        .doc(id)
        .get()
        .then((result) => {
          if (result.exists) {
            setdescription(result.data().ProgressText);
          }
        });
    }
  };
  let Deleteprogress = (id) => {
    if (window.confirm("Delete the item?")) {
      db.collection("web_user")
        .doc(email)
        .collection("Progress")
        .doc(id)
        .delete()
        .then(() => {
          Swal.fire({
            icon: "success",
            type: "success",
            text: "Delete successfully!",
            showConfirmButton: true,
            timer: 3500,
          });
        });
    }
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Clinical Progress</ModalHeader>
        <ModalBody>
          <div className="form-group"></div>
          <label htmlFor="des">Description</label>
          <ReactQuill
            value={description}
            onChange={onDescChange}
            style={{ marginBottom: "35px", width: "100%", height: "200px" }}
          />
        </ModalBody>
        <ModalFooter>
          {editid ? (
            <Button color="primary" onClick={updateprogress}>
              Update
            </Button>
          ) : (
            <Button color="primary" onClick={submitprogress}>
              Create
            </Button>
          )}
        </ModalFooter>
      </Modal>

      <Row>
        <Col xl={4} style={{ paddingBottom: "10px" }}>
          <Button color="primary" onClick={toggle}>
            Create
          </Button>
        </Col>
      </Row>
      {/* ---------------------- */}

      {descdata.length > 0
        ? descdata.map((d, index) => {
            return (
              <Card
                key={index}
                className={classes.root}
                variant="outlined"
                style={{
                  width: "400px",
                  height: "300px",
                  display: "inline-block",
                  margin: "20px",
                }}
              >
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {d.data().Date}
                  </Typography>
                  <Typography
                    style={{
                      display: "-webkit-box",
                      width: "100%",
                      height: "175px",
                      WebkitLineClamp: "5",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: d.data().ProgressText,
                    }}
                  ></Typography>
                </CardContent>
                <CardActions>
                  <Button
                    style={{ width: "100px" }}
                    color="success"
                    onClick={() => Editprogress(d.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{ width: "100px" }}
                    color="success"
                    onClick={() => Deleteprogress(d.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            );
          })
        : ""}
    </div>
  );
}

export default Progress_details;
