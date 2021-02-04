import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import LocalGroceryStoreIcon from "@material-ui/icons/LocalGroceryStore";
import "./new.css";
import Doctor from "./newcomponet/Doctor";
import ChatRoom from "./newcomponet/ChatRoom";
import Docter_img from "./newcomponet/Docter_img";
import Pation_img from "./newcomponet/Pation_img";
import Pation from "./newcomponet/Pation";
import UserDetails from "./newcomponet/UserDetails";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "90%",
    margin: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: "white",
    backgroundColor: "#9196b5",
  },
}));

function New() {
  let UserEmail_id = useSelector((state) => state.User_Email_id);
  const Select_Service = useSelector((state) => state.Select_Service);
  const Select_Servicetype = useSelector((state) => state.Select_Servicetype);
  const chatstart = useSelector((state) => state.ChatSession);
  console.log(UserEmail_id, Select_Service, Select_Servicetype);

  const [page2, setpage2] = useState(null);
  const [page, setpage] = useState(<Pation />);
  const [pation_Img, setpation_Img] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (UserEmail_id) {
      setpage2(<UserDetails id={UserEmail_id} />);
      setpation_Img(<Pation_img id={UserEmail_id} />);
    }
    return () => {
      setpage2(null);
      setpation_Img(null);
    };
  }, [UserEmail_id]);

  //
  useEffect(() => {
    if ((Select_Service && Select_Servicetype) || chatstart === "start") {
      setpage2(<ChatRoom id={UserEmail_id} />);
    } else {
      setpage2(<UserDetails id={UserEmail_id} />);
    }
  }, [Select_Service, Select_Servicetype, chatstart]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid container item sm={12} className="chatbox_container">
            {/*  */}
            <Grid
              item
              container
              sm={1}
              xs={2}
              justify="center"
              className="sidebox_firstbox"
            >
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item style={{ marginBottom: "20px" }}>
                  <Avatar alt="K" src="/static/images/avatar/1.jpg" />
                </Grid>
              </Grid>
            </Grid>
            {/*  */}

            <Grid
              container
              item
              sm={3}
              xs={5}
              justify="center"
              className="sidebox_secondbox"
            >
              <Grid container direction="column" justify="flex-start">
                <Grid item className="doctor_hading">
                  <h5>patient List</h5>
                </Grid>
                {page}
              </Grid>
            </Grid>
            <Grid item container sm={8} xs={5} className="sidebox_thiredbox">
              <Grid container direction="column" justify="flex-start">
                <Grid item className="doctor_hading">
                  {pation_Img}
                </Grid>
                {page2}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default New;
