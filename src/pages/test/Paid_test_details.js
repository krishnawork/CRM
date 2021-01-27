import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FileSaver from "file-saver";
import generatePDF from "../../reportGenerator";
let db = firebase.firestore();
let store = firebase.storage();
//
const useStyles = makeStyles((theme) => ({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    borderRadius: 10,
    height: 50,
    cursor: "pointer",
  },
  psychology: {
    background: "linear-gradient(45deg, #8bc34a 30%, #a2cf6e 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  seassion: {
    background: "linear-gradient(45deg, #cddc39  30%, #d7e360 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  therapi: {
    background: "linear-gradient(45deg, #ff5722, 30%, #ff784e 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  white: {
    color: "white",
  },
}));
//

function Paid_test_details({ email }) {
  const classes = useStyles();
  const [Loadind, setLoadind] = useState("Loading");
  const [selfdata, setselfdata] = useState([]);
  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("web_user")
        .doc(email)
        .collection("Paid")
        .orderBy("TimeNow", "desc")
        .onSnapshot((result) => {
          setselfdata([]);
          if (!result.empty) {
            result.forEach((d) => {
              setselfdata((old) => [...old, d]);
            });
          } else {
            setLoadind("Data Not Available");
          }
        });
    }
    return () => {
      setLoadind("Loading");
    };
  }, [email]);

  let Showfileselect = (id) => {
    localStorage.setItem("id", id);
    document.querySelector("#fileLoader").click();
  };

  let filedetails = async (e) => {
    const file = e.target.files[0];
    const storageRef = store.ref(`/Paid_test/${email}/Upload_File`);
    const fileRef = storageRef.child(file.name);

    // setFileUrl(await fileRef.getDownloadURL());
    console.log(file);
    if (file.type === "application/pdf") {
      await fileRef.put(file);
      db.collection("web_user")
        .doc(email)
        .collection("Paid")
        .doc(localStorage.getItem("id"))
        .update({
          Upload_file: await fileRef.getDownloadURL(),
        })
        .then((r) => {});
    } else {
      alert("This File Not Support");
    }
  };
  let pdf_download = (event, pdf_blob) => {
    event.preventDefault();

    FileSaver.saveAs(pdf_blob, "test_result.pdf");
    // if (pdf_blob.includes("blob:")) {
    // } else {
    //   var blob = new Blob([pdf_blob], { type: "application/pdf" });
    //   FileSaver.saveAs(blob, "test_result.pdf");
    // }
  };

  //
  let GeneratePDF = (data, type) => {
    if (localStorage.getItem("type") === type) {
      generatePDF(data);
    } else {
    }
  };

  //
  return (
    <div>
      <div>
        {/* <h1>Hari</h1> */}
        <Grid container spacing={3}>
          {selfdata.length > 0
            ? selfdata.map((d, index) => {
                return (
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        {d.data().Test}
                      </Typography>
                      <input
                        type="file"
                        id="fileLoader"
                        name="files"
                        title="Load File"
                        onChange={filedetails}
                      />
                      <Typography variant="h5" component="h2">
                        {d.data().TimeNow}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Test_type: <br />
                        {d.data().Test_type}
                        <br />
                      </Typography>
                      <Typography variant="body2" component="p">
                        <br />
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          localStorage.setItem("type", d.data().Test_type);
                          GeneratePDF(d.data().Details, d.data().Test_type);
                        }}
                      >
                        DownLoad PDF{" "}
                      </Button>
                      {d.data().Upload_file ? (
                        <Button
                          size="small"
                          onClick={() => Showfileselect(d.id)}
                        >
                          Upload PDF
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => Showfileselect(d.id)}
                        >
                          Upload PDF
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                );
              })
            : Loadind}
        </Grid>
      </div>
    </div>
  );
}

export default Paid_test_details;
