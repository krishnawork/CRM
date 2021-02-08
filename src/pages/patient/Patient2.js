import React from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
} from "reactstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import s from "./Dashboard.module.scss";
import Widget from "../../components/Widget/Widget";
import stocksImg from "../../images/stocks.svg";
import {
  fetchUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  editFalse,
} from "../../actions/user";
import { createReferral } from "../../actions/referral";
import ReactQuill from "react-quill";
import { toast, ToastContainer } from "react-toastify";
import firebase from "../../firebase";
let db = firebase.firestore();
var validator = require("email-validator");

let mobilecount;
class Patient extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      modal_referral: false,
      is_create: false,
      id: 0,
      fname: "",
      lname: "",
      email: "",
      number: "",
      password: "",
      confirm_password: "",
      from: "patient",
      refer_to_name: "",
      refer_to_number: "",
      Gender: "",
      Address: "",
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchUsers("patient"));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.user != null &&
      nextProps.edit == true &&
      prevState.id != nextProps.user.id &&
      prevState.is_create == false
    ) {
      return {
        id: nextProps.user.id,
        fname: nextProps.user.first_name,
        lname: nextProps.user.last_name,
        email: nextProps.user.email,
        number: nextProps.user.number,
      };
    }

    return null;
  }

  createUser = (event) => {
    event.preventDefault();
    if (
      this.state.fname === "" ||
      this.state.lname === "" ||
      this.state.email === "" ||
      this.state.number === "" ||
      this.state.Address === ""
    ) {
      toast.error("Please enter all the fields!");
    } else if (validator.validate(this.state.email) === false) {
      toast.error("Please enter a valid email address!");
    } else if (this.state.number.length !== 10) {
      toast.error("Please enter a 10-digit mobile number!");
    } else if (
      !document.querySelector("input[type='radio'][name='gender']:checked")
    ) {
      toast.error("Please Select a Gender");
    } else {
      if (this.props.user == null) {
        if (this.state.password === "") {
          toast.error("Please enter password field!");
        } else if (this.state.password !== this.state.confirm_password) {
          toast.error("Both passwords should match!");
        } else {
          db.collection("web_user")
            .doc(this.state.email)
            .set({
              fname: this.state.fname,
              lname: this.state.lname,
              email: this.state.email,
              number: this.state.number,
              gender: this.state.Gender,
              address: this.state.Address,
              password: this.state.password,
              user_type: "patient",
              type: "offline",
            })
            .then((re) => {
              this.props.dispatch(
                createUser({
                  fname: this.state.fname,
                  lname: this.state.lname,
                  email: this.state.email,
                  number: this.state.number,
                  password: this.state.password,
                  gender: this.state.Gender,
                  address: this.state.Address,
                  user_type: "patient",
                  type: "offline",
                })
              );
            });
        }
      } else {
        db.collection("web_user")
          .doc(this.state.email)
          .set(
            {
              fname: this.state.fname,
              lname: this.state.lname,
              email: this.state.email,
              number: this.state.number,
              password: this.state.password,
              user_type: "patient",
              type: "offline",
            },
            { merge: true }
          )
          .then((res) => {
            this.props.dispatch(
              updateUser({
                id: this.state.id,
                fname: this.state.fname,
                lname: this.state.lname,
                email: this.state.email,
                number: this.state.number,
              })
            );
          });
      }
      this.setState({ modal: false });
    }
  };

  onFNameChange = (event) => {
    this.setState({ fname: event.target.value });
  };
  onLNameChange = (event) => {
    this.setState({ lname: event.target.value });
  };
  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };
  onNumberChange = (event) => {
    this.setState({ number: event.target.value });
  };
  onAddressChange = (event) => {
    this.setState({ Address: event.target.value });
  };
  onGengerChange = (gender) => {
    this.setState({ Gender: gender });
  };
  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };
  onReferToNameChange = (event) => {
    this.setState({ refer_to_name: event.target.value });
  };
  onReferToNumberChange = (event) => {
    this.setState({ refer_to_number: event.target.value });
  };
  onConfirmPasswordChange = (event) => {
    this.setState({ confirm_password: event.target.value });
  };

  toggle = () => {
    this.setState({
      is_create: true,
      id: 0,
      fname: "",
      lname: "",
      email: "",
      number: "",
      password: "",
      confirm_password: "",
      from: "patient",
    });
    this.setState({ modal: !this.state.modal });
  };

  toggle_referral = () => {
    this.setState({ refer_to_name: "", refer_to_number: "" });
    this.setState({ modal_referral: !this.state.modal_referral });
  };

  onEdit = (event, id) => {
    event.preventDefault();
    this.props.dispatch(getUser({ id: id }));
    this.setState({ modal: true, is_create: false });
  };

  componentWillReceiveProps(nextProps, prevState) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ edit: nextProps.edit });
  }

  onDelete = (event, id, email) => {
    event.preventDefault();
    if (window.confirm("Delete the item?")) {
      db.collection("web_user")
        .doc(email)
        .delete()
        .then((res) => {
          this.props.dispatch(deleteUser({ id: id }));
        });
    }
  };

  createRefer = (event) => {
    event.preventDefault();
    this.props.dispatch(
      createReferral({
        from: this.state.from,
        referral: this.state.id,
        refer_to_name: this.state.refer_to_name,
        refer_to_number: this.state.refer_to_number,
      })
    );
    this.setState({ modal_referral: false });
  };

  onRefer = (event, id) => {
    event.preventDefault();
    this.setState({ id: id });
    this.setState({ modal_referral: true });
  };

  render() {
    const { users, user } = this.props;
    console.log("userrrrr", users);
    // console.log("userrrrr", this.state);
    return (
      <div className={s.root}>
        <ToastContainer />
        <Row>
          <Col xl={4} style={{ paddingBottom: "10px" }}>
            <Button color="primary" onClick={this.toggle}>
              Create
            </Button>{" "}
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            {users.length > 0 ? this.props.settotallength(users.length) : ""}
            {users.length > 0 ? (
              <Widget title={<p style={{ fontWeight: 700 }}>Patients</p>}>
                <Table responsive>
                  <thead>
                    <tr className="fs-sm">
                      <th className="hidden-sm-down">#</th>
                      <th className="hidden-sm-down">Name</th>
                      <th className="hidden-sm-down">Email</th>
                      <th className="hidden-sm-down">Contact Number</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .slice(
                        this.props.pagination.start,
                        this.props.pagination.end
                      )
                      .map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>
                            {row.first_name} {row.last_name}
                          </td>
                          <td>{row.email}</td>

                          <td>
                            {localStorage.getItem("user_Type_set") === "admin"
                              ? row.number
                              : row.number
                              ? `XXXXXX${row.number.slice(5, 9)}`
                              : ""}
                          </td>
                          <td>
                            <a
                              onClick={(event) => this.onEdit(event, row.id)}
                              title="Edit"
                            >
                              <img
                                src={require("../../images/edit.png")}
                                width="20"
                                height="25"
                              />
                            </a>
                            <a
                              onClick={(event) =>
                                this.onDelete(event, row.id, row.email)
                              }
                              title="Delete"
                            >
                              <img
                                src={require("../../images/delete.png")}
                                width="40"
                                height="25"
                              />
                            </a>
                            <a
                              onClick={(event) => this.onRefer(event, row.id)}
                              title="Referral"
                            >
                              <img
                                src={require("../../images/referral.png")}
                                width="20"
                                height="25"
                              />
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Widget>
            ) : (
              <p style={{ fontWeight: 700 }}>NO DATA FOUND</p>
            )}
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {this.state.is_create == true ? "Register Patient" : "Edit Patient"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xl={6}>
                {this.state.is_create == true ? (
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      className="form-control"
                      id="email"
                      value={this.state.email}
                      onChange={(event) => this.onEmailChange(event)}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      className="form-control"
                      value={this.state.email}
                      disabled
                      // onChange={(event) => this.onEmailChange(event)}
                    />
                  </div>
                )}
              </Col>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="fname">FirstName</label>
                  <input
                    className="form-control"
                    id="fname"
                    value={this.state.fname}
                    onChange={(event) => this.onFNameChange(event)}
                  />
                </div>
              </Col>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="lname">LastName</label>
                  <input
                    className="form-control"
                    id="lname"
                    value={this.state.lname}
                    onChange={(event) => this.onLNameChange(event)}
                  />
                </div>
              </Col>
              <Col xl={6}>
                <div className="form-group">
                  <label htmlFor="number">Contact Number</label>
                  <input
                    className="form-control"
                    id="number"
                    value={this.state.number}
                    onChange={(event) => this.onNumberChange(event)}
                  />
                </div>
              </Col>
              {this.state.is_create == true ? (
                <Col xl={6}>
                  <div className="form-group">
                    <label htmlFor="number">Gender</label>
                    <br />
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      style={{ margin: "5px" }}
                      onChange={(event) => this.onGengerChange("male")}
                    />
                    <label for="male" style={{ margin: "2px" }}>
                      Male
                    </label>

                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      style={{ margin: "5px" }}
                      onChange={(event) => this.onGengerChange("female")}
                    />
                    <label for="female" style={{ margin: "2px" }}>
                      Female
                    </label>

                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      style={{ margin: "5px" }}
                      onChange={(event) => this.onGengerChange("other")}
                    />
                    <label for="other">Other</label>
                  </div>
                </Col>
              ) : (
                ""
              )}

              {this.state.is_create == true ? (
                <Col xl={6}>
                  <div className="form-group">
                    <label htmlFor="password">Address</label>
                    <input
                      className="form-control"
                      id="Address"
                      type="text"
                      value={this.state.Address}
                      onChange={(event) => this.onAddressChange(event)}
                    />
                  </div>
                </Col>
              ) : (
                ""
              )}

              {this.state.id == 0 ? (
                <>
                  <Col xl={6}>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        className="form-control"
                        id="password"
                        type="password"
                        value={this.state.password}
                        onChange={(event) => this.onPasswordChange(event)}
                      />
                    </div>
                  </Col>
                  <Col xl={6}>
                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirm-Password</label>
                      <input
                        className="form-control"
                        id="confirm-password"
                        type="password"
                        value={this.state.confirm_password}
                        onChange={(event) =>
                          this.onConfirmPasswordChange(event)
                        }
                      />
                    </div>
                  </Col>
                </>
              ) : (
                ""
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(event) => this.createUser(event)}>
              {this.state.is_create == true ? "Create" : "Update"}
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modal_referral} toggle={this.toggle_referral}>
          <ModalHeader toggle={this.toggle_referral}>
            Refer To Doctor
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xl={12}>
                <div className="form-group">
                  <label htmlFor="refer_to_name">Refer to Doctor Name: </label>
                  <input
                    className="form-control"
                    id="refer_to_name"
                    value={this.state.refer_to_name}
                    onChange={(event) => this.onReferToNameChange(event)}
                  />
                </div>
              </Col>
              <Col xl={12}>
                <div className="form-group">
                  <label htmlFor="refer_to_number">Contact Number</label>
                  <input
                    className="form-control"
                    id="refer_to_number"
                    value={this.state.refer_to_number}
                    onChange={(event) => this.onReferToNumberChange(event)}
                  />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(event) => this.createRefer(event)}
            >
              Create
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle_referral}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.auth.users,
  user: state.auth.user,
  edit: state.auth.edit,
});

export default withRouter(connect(mapStateToProps)(Patient));
