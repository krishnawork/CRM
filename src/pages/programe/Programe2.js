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
  Input,
} from "reactstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import s from "./Dashboard.module.scss";
import Widget from "../../components/Widget/Widget";
import stocksImg from "../../images/stocks.svg";
import { fetchAppoinment } from "../../actions/appoinment";
import {
  fetchOrderedProgram,
  getAllPrograms,
  updateProgram,
  createProgram,
  deleteProgram,
} from "../../actions/program";
import { fetchOfflineUsers, fetchDoctors } from "../../actions/user";
import ReactQuill from "react-quill";
import { toast, ToastContainer } from "react-toastify";
import FileSaver from "file-saver";
import Swal from "sweetalert2";
var validator = require("email-validator");
var date = new Date();

var user_Doctor = [];

var formatedDate = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;

class Programe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modal1: false,
      user: 0,
      test: 0,
      selectedFile: null,
      ShiftDate: [],
      user_Doctor: [],
      user_Patient: [],
      weekDay: [],
      Doctor_shift: [],
      interval_time: [],
      AllShift: [],
      allProgram: [],
      session_schedule: [],
      id: 0,
      programeID: "",
      userID: "",
      session: 0,
      patient_id: "",
      program_id: "",
      purpose: "",
      searchpatient: "",
      searchDataValue: [],
    };
    this.onDropdownSelectedDoctors = this.onDropdownSelectedDoctors.bind(this);
    this.SelectDate = this.SelectDate.bind(this);
    this.onDropdownShiftItemsForDoctors = this.onDropdownShiftItemsForDoctors.bind(
      this
    );
    this.onDropdownIntervalTimeForDoctors = this.onDropdownIntervalTimeForDoctors.bind(
      this
    );
  }

  componentDidMount() {
    // this.props.dispatch(fetchOrderedProgram());
    // this.props.dispatch(getAllPrograms());
    // this.props.dispatch(fetchOfflineUsers());
    // this.props.dispatch(fetchAppoinment());
    // this.props.dispatch(fetchDoctors());
    // this.createShiftItemsForDoctors()
    this.callAllDidMountFunction();
  }

  callAllDidMountFunction() {
    this.props.dispatch(fetchOrderedProgram());
    this.props.dispatch(getAllPrograms());
    this.props.dispatch(fetchOfflineUsers());
    this.props.dispatch(fetchAppoinment());
    this.props.dispatch(fetchDoctors());
  }

  onFileChange = (event) => {
    Swal.fire({
      icon: "error",
      type: "error",
      text: "Work In progress",
      showConfirmButton: true,
    });
  };

  clickOnRow = (val) => {
    alert(this.get_program_name(val.programID));
  };

  onEdit = (event, row) => {
    event.preventDefault();
    // this.props.dispatch(getAppoinment({id: row.id}));
    this.setState({
      user: 0,
      test: 0,
      selectedFile: null,
      ShiftDate: [],
      user_Doctor: [],
      user_Patient: [],
      weekDay: [],
      Doctor_shift: [],
      interval_time: [],
      AllShift: [],
      allProgram: [],
      session_schedule: [],
      patient_id: "",
      program_id: "",
      purpose: "",
    });

    this.setState({
      modal1: true,
      id: row.id,
      programeID: row.programID,
      userID: row.userID,
      session: row.purpose,
    });

    // user.schedule != null ? data.length > 0 ? data[0].shiftone[0] : '' : '',
    console.log("dataSession", JSON.parse(row.session_schedule));
    var dataSession =
      row.session_schedule != null ? JSON.parse(row.session_schedule) : "";

    if (dataSession != "" && dataSession.length > 0) {
      let user_Doctor = [...this.state.user_Doctor];
      let ShiftDate = [...this.state.ShiftDate];
      let Doctor_shift = [...this.state.Doctor_shift];
      let interval_time = [...this.state.interval_time];
      let weekDay = [...this.state.weekDay];

      dataSession.forEach(function (value, i) {
        console.log("EditDAta", value, i);
        user_Doctor[i] = value.doctorId;
        ShiftDate[i] = value.ShiftDate;
        Doctor_shift[i] = value.Doctor_shift;
        interval_time[i] = value.interval_time;

        if (value.ShiftDate != "") {
          var allDay = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wensday",
            "Thrusday",
            "Friday",
            "Saturday",
          ];
          var date = new Date(value.ShiftDate);
          var n = date.getDay();
          weekDay[i] = allDay[n];
        }
      });

      this.setState({ user_Doctor: user_Doctor });
      this.setState({ ShiftDate: ShiftDate });
      this.setState({ Doctor_shift: Doctor_shift });
      this.setState({ interval_time: interval_time });
      this.setState({ weekDay: weekDay });
    }

    // console.log("this.state.user_Doctor",this.state.user_Doctor,this.state.ShiftDate,this.state.Doctor_shift,this.state.interval_time)

    // this.onDropdownSelectedDoctors
    // this.SelectDate
    // this.onDropdownShiftItemsForDoctors
    // this.onDropdownIntervalTimeForDoctors
    // var schedule_data = []
    // var obj = {}
    // this.state.user_Doctor.forEach(function(val,key) {
    //   obj.sessionId = key+1
    //   obj.doctorId = val
    //   schedule_data[key] = obj
    // });

    // this.state.ShiftDate.forEach(function(val,key) {
    //   obj.ShiftDate = val
    //   schedule_data[key] = obj
    // });
  };

  onDelete = (event, id) => {
    event.preventDefault();
    if (window.confirm("Delete the item?")) {
      this.props.dispatch(deleteProgram({ id: id }));
    }
  };

  createSelectItemsUser = () => {
    let items = [];
    items.push(
      <option key={-1} value="">
        Select Patients
      </option>
    );
    for (let i = 0; i < this.props.users.length; i++) {
      items.push(
        <option key={this.props.users[i].id} value={this.props.users[i].id}>
          {this.props.users[i].first_name} {this.props.users[i].last_name}
        </option>
      );
    }

    return items;
  };

  createSelectItemsPrograms = () => {
    let items = [];
    items.push(
      <option key={-1} value="">
        Select Programs
      </option>
    );
    for (let i = 0; i < this.props.allProgram.length; i++) {
      items.push(
        <option
          key={this.props.allProgram[i].id}
          value={this.props.allProgram[i].id}
        >
          {this.props.allProgram[i].title}
        </option>
      );
    }

    return items;
  };

  createSelectItemsDoctors = (val) => {
    // console.log("this.props.doctors",val)
    let items = [];
    items.push(
      <option key={-1} value="">
        Select Doctors
      </option>
    );
    for (let i = 0; i < this.props.doctors.length; i++) {
      //console.log(i);
      items.push(
        <option key={this.props.doctors[i].id} value={this.props.doctors[i].id}>
          {this.props.doctors[i].first_name} {this.props.doctors[i].last_name}
        </option>
      );
    }

    return items;
  };

  createShiftItemsForDoctors = (val) => {
    // console.log("createShiftItemsForDoctors",val)
    let items = [];
    items.push(
      <option key={0} value="abc">
        Select Shift
      </option>
    );
    if (this.props.doctors.length > 0) {
      for (let i = 0; i < this.props.doctors.length; i++) {
        if (this.props.doctors[i].id == this.state.user_Doctor[val]) {
          var schedule =
            this.props.doctors[i].schedule !== null
              ? JSON.parse(this.props.doctors[i].schedule)
              : "";

          for (let j = 0; j < schedule.length; j++) {
            if (schedule[j].day == this.state.weekDay[val]) {
              items.push(
                <option
                  key={schedule[j].shiftone[0]}
                  value={
                    schedule[j].shiftone[0] + " - " + schedule[j].shiftone[1]
                  }
                >
                  {schedule[j].shiftone[0]} - {schedule[j].shiftone[1]}
                </option>
              );
              items.push(
                <option
                  key={schedule[j].shifttwo[0]}
                  value={
                    schedule[j].shifttwo[0] + " - " + schedule[j].shifttwo[1]
                  }
                >
                  {schedule[j].shifttwo[0]} - {schedule[j].shifttwo[1]}
                </option>
              );
            }
          }
        }
      }
    }

    return items;
  };
  createSelectItemsTest = () => {
    let items = [];
    for (let i = 0; i < this.props.tests.length; i++) {
      items.push(
        <option key={this.props.tests[i].id} value={this.props.tests[i].id}>
          {this.props.tests[i].name}
        </option>
      );
    }
    return items;
  };

  createIntervalTimeForDoctors = (i) => {
    let items = [];
    items.push(
      <option key="a" value="default">
        Default
      </option>
    );
    console.log(
      "this.state.Doctor_shift",
      this.state.Doctor_shift,
      this.state.Doctor_shift[i]
    );
    if (
      this.state.Doctor_shift.length > 0 &&
      this.state.Doctor_shift[i] !== undefined
    ) {
      var k = this.state.Doctor_shift[i];
      var res = k.split(" - ");
      var resTime = parseInt(res[1]) - parseInt(res[0]);
      var j = [];
      var l = parseInt(res[0]);
      var m = 0;

      if (resTime > 0) {
        for (let i = 0; i < resTime; i++) {
          l = parseInt(res[0]) + i + 1;
          m = parseInt(res[0]) + i;
          var opt = m + "-" + l;
          items.push(
            <option key={i} value={opt}>
              {opt}
            </option>
          );
        }
      }
    }

    return items;
  };

  onDropdownSetStateName(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onDropdownSelectedDoctors(i, event) {
    let values = [...this.state.user_Doctor];
    values[i] = event.target.value;

    this.setState({ user_Doctor: values });
  }

  onDropdownShiftItemsForDoctors = (i, event) => {
    var values = [...this.state.Doctor_shift];
    values[i] = event.target.value;

    this.setState({ Doctor_shift: values });
  };

  onDropdownIntervalTimeForDoctors(i, event) {
    var values = [...this.state.interval_time];
    values[i] = event.target.value;
    this.setState({ interval_time: values });
  }

  convertDateFormate = (val) => {
    var date = new Date(val);

    var formatedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return formatedDate;
  };

  SelectDate = (i, event) => {
    let values = [...this.state.ShiftDate];
    values[i] = event.target.value;
    // var val = 'ShiftDate['+i+']';
    this.setState({ ShiftDate: values });
    var weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wensday",
      "Thrusday",
      "Friday",
      "Saturday",
    ];

    var date = new Date(event.target.value);
    var n = date.getDay();
    var weekDAy = weekday[n];
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    let values1 = [...this.state.weekDay];
    values1[i] = weekDAy;

    this.setState({ weekDay: values1 });
    console.log("SelectDate", values1, i, event.target.value);
  };

  createList = (event) => {
    event.preventDefault();

    //  console.log("this.state.user_Doctor",this.state.user_Doctor,this.state.ShiftDate,this.state.Doctor_shift,this.state.interval_time)

    //  return false
    if (this.state.id == 0) {
      if (
        this.state.patient_id === "" ||
        this.state.program_id === "" ||
        this.state.purpose === ""
      ) {
        toast.error("Please fill all the fields!");
        return;
      }

      this.props.dispatch(
        createProgram({
          patient_id: this.state.patient_id,
          program_id: this.state.program_id,
          purpose: this.state.purpose,
        })
      );

      this.setState({ modal: false });
    } else {
      var schedule_data = [];

      if (this.state.session > 0) {
        for (var j = 0; j < this.state.session; j++) {
          var obj = {};

          obj.sessionId = j + 1;
          obj.doctorId = this.state.user_Doctor[j];
          obj.ShiftDate = this.state.ShiftDate[j];
          obj.Doctor_shift = this.state.Doctor_shift[j];
          obj.interval_time = this.state.interval_time[j];

          schedule_data.push(obj);
        }
      }

      this.props.dispatch(
        updateProgram({
          id: this.state.id,
          schedule: JSON.stringify(schedule_data),
        })
      );
      this.setState({ modal1: false });
    }
  };

  get_user_name = (condition) => {
    //console.log("condition",this.props.users,condition);
    let fname = "";
    this.props.users
      .filter((e) => e.id === condition)
      .map((key, i) => (fname = key.first_name + " " + key.last_name));
    return fname;
  };

  get_program_name = (condition) => {
    let fname = "";
    this.props.allProgram
      .filter((e) => e.id === condition)
      .map((key, i) => (fname = key.title));
    return fname;
  };

  get_doctor_name = (condition) => {
    // console.log(condition);
    let fname = "";
    this.props.doctors
      .filter((e) => e.id === condition)
      .map((key, i) => (fname = key.first_name + " " + key.last_name));
    return fname;
  };
  toggle = () => {
    this.setState({
      user: 0,
      test: 0,
      selectedFile: null,
      ShiftDate: [],
      user_Doctor: [],
      user_Patient: [],
      weekDay: [],
      Doctor_shift: [],
      interval_time: [],
      AllShift: [],
      allProgram: [],
      session_schedule: [],
      id: 0,
      programeID: "",
      userID: "",
      session: 0,
      patient_id: "",
      program_id: "",
      purpose: "",
    });
    this.setState({ modal: !this.state.modal });
  };

  toggle1 = () => {
    this.setState({
      user: 0,
      test: 0,
      selectedFile: null,
      ShiftDate: [],
      user_Doctor: [],
      user_Patient: [],
      weekDay: [],
      Doctor_shift: [],
      interval_time: [],
      AllShift: [],
      allProgram: [],
      session_schedule: [],
      id: 0,
      programeID: "",
      userID: "",
      session: 0,
      patient_id: "",
      program_id: "",
      purpose: "",
    });
    this.setState({ modal1: !this.state.modal1 });
  };
  generateRow = (val) => {
    var rowData = [];
    rowData.push(
      <Row>
        <Col xl={1}>
          <div className="form-group">
            <h4>#</h4>
          </div>
        </Col>
        <Col xl={3}>
          <div className="form-group">
            <h4>Doctor</h4>
          </div>
        </Col>
        <Col xl={3}>
          <div className="form-group">
            <h4>Date</h4>
          </div>
        </Col>
        <Col xl={3}>
          <div className="form-group">
            <h4>shift</h4>
          </div>
        </Col>
        <Col xl={2}>
          <div className="form-group">
            <h4>interval</h4>
          </div>
        </Col>
      </Row>
    );
    for (var i = 0; i < val; i++) {
      rowData.push(
        <Row>
          <Col xl={1}>
            <div className="form-group">
              <h4>{i + 1}</h4>
            </div>
          </Col>
          <Col xl={3}>
            <div key={i} className="form-group">
              <Input
                type="select"
                onChange={this.onDropdownSelectedDoctors.bind(this, i)}
                label="Doctors"
                value={this.state.user_Doctor[i]}
              >
                {this.createSelectItemsDoctors(i)}
              </Input>
            </div>
          </Col>
          <Col xl={3}>
            <div key={i} className="form-group">
              <Input
                type="date"
                name="Date"
                id="Date"
                // defaultValue={this.state.Date}
                value={this.state.ShiftDate[i]}
                onChange={this.SelectDate.bind(this, i)}
                min={formatedDate}
              />
            </div>
          </Col>
          <Col xl={3}>
            <div key={i} className="form-group">
              <Input
                type="select"
                onChange={this.onDropdownShiftItemsForDoctors.bind(this, i)}
                label="Doctors"
                value={this.state.Doctor_shift[i]}
              >
                {this.createShiftItemsForDoctors(i)}
                {/* {this.state.AllShift} */}
              </Input>
            </div>
          </Col>
          <Col xl={2}>
            <div key={i} className="form-group">
              <Input
                type="select"
                onChange={this.onDropdownIntervalTimeForDoctors.bind(this, i)}
                label="Doctors"
                value={this.state.interval_time[i]}
              >
                {this.createIntervalTimeForDoctors(i)}
              </Input>
            </div>
          </Col>
        </Row>
      );
    }
    return rowData;
  };

  // krushnkant
  update = () => {
    this.props.ordered_programs.map((row) => {
      if (this.get_user_name(row.userID).match(this.state.searchpatient)) {
        this.setState((prevState) => ({
          searchDataValue: [
            ...prevState.searchDataValue,
            {
              email: row.email,
              id: row.id,
              programID: row.programID,
              userID: row.userID,
              purpose: row.purpose,
            },
          ],
        }));
      }
    });
  };

  search = (event) => {
    this.setState({ searchpatient: event.target.value });
    this.setState({ searchDataValue: [] });
    this.update();
  };
  //

  render() {
    const { tests, paid_tests, users, ordered_programs } = this.props;
    // console.log("paid_tests", this.state);

    return (
      <div className={s.root}>
        <ToastContainer />
        <Row>
          <Col xl={4} style={{ paddingBottom: "10px" }}>
            <Button color="primary" onClick={this.toggle}>
              Create
            </Button>{" "}
          </Col>
          <Col xl={2} style={{ paddingBottom: "10px" }}>
            <p></p>
          </Col>
          <Col xl={6} style={{ paddingBottom: "10px" }}>
            <input
              type="text"
              list="patient"
              placeholder="Search"
              className="changeborder"
              style={{
                height: "40px",
                width: "100%",
                border: "1px solid gray",
                padding: "10px",
                borderRadius: "20px",
              }}
              onChange={(event) => {
                // this.setState({ searchpatient: event.target.value });
                this.search(event);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            {ordered_programs.length > 0
              ? this.props.settotallength(ordered_programs.length)
              : ""}
            {ordered_programs.length > 0 ? (
              <Widget title={<p style={{ fontWeight: 700 }}>Program</p>}>
                <Table responsive>
                  <thead>
                    <tr className="fs-sm">
                      <th className="hidden-sm-down">#</th>
                      <th className="hidden-sm-down">Program</th>
                      <th className="hidden-sm-down">Patient</th>
                      <th className="hidden-sm-down">Session</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.searchpatient === "" ? (
                      <>
                        {this.props.setshow(true)}
                        {ordered_programs
                          .slice(
                            this.props.pagination.start,
                            this.props.pagination.end
                          )
                          .map((row) => (
                            <tr style={{ cursor: "pointer" }} key={row.id}>
                              <td onClick={() => this.clickOnRow(row)}>
                                {row.id}
                              </td>
                              <td onClick={() => this.clickOnRow(row)}>
                                {this.get_program_name(row.programID)}
                              </td>
                              <td onClick={() => this.clickOnRow(row)}>
                                {this.get_user_name(row.userID)}
                              </td>
                              <td onClick={() => this.clickOnRow(row)}>
                                {row.purpose}
                              </td>
                              <td>
                                <a
                                  href="!#"
                                  onClick={(event) => this.onEdit(event, row)}
                                >
                                  <img
                                    alt="edit"
                                    src={require("../../images/edit.png")}
                                    width="20"
                                    height="25"
                                  />
                                </a>
                                <a
                                  href="!#"
                                  onClick={(event) =>
                                    this.onDelete(event, row.id)
                                  }
                                >
                                  <img
                                    alt="delete"
                                    src={require("../../images/delete.png")}
                                    width="40"
                                    height="25"
                                  />
                                </a>
                              </td>
                            </tr>
                          ))}
                      </>
                    ) : (
                      <>
                        {this.props.setshow(false)}
                        {this.state.searchDataValue != null
                          ? this.state.searchDataValue.map((row) => (
                              <tr style={{ cursor: "pointer" }} key={row.id}>
                                <td onClick={() => this.clickOnRow(row)}>
                                  {row.id}
                                </td>
                                <td onClick={() => this.clickOnRow(row)}>
                                  {this.get_program_name(row.programID)}
                                </td>
                                <td onClick={() => this.clickOnRow(row)}>
                                  {this.get_user_name(row.userID)}
                                </td>
                                <td onClick={() => this.clickOnRow(row)}>
                                  {row.purpose}
                                </td>
                                <td>
                                  <a
                                    href="!#"
                                    onClick={(event) => this.onEdit(event, row)}
                                  >
                                    <img
                                      alt="edit"
                                      src={require("../../images/edit.png")}
                                      width="20"
                                      height="25"
                                    />
                                  </a>
                                  <a
                                    href="!#"
                                    onClick={(event) =>
                                      this.onDelete(event, row.id)
                                    }
                                  >
                                    <img
                                      alt="delete"
                                      src={require("../../images/delete.png")}
                                      width="40"
                                      height="25"
                                    />
                                  </a>
                                </td>
                              </tr>
                            ))
                          : "NO DATA FOUND"}
                      </>
                    )}
                  </tbody>
                </Table>
              </Widget>
            ) : (
              <p style={{ fontWeight: 700 }}>NO DATA FOUND</p>
            )}
          </Col>
        </Row>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create Program</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="user">Patients</label>
              <Input
                name="patient_id"
                type="select"
                onChange={(e) => this.onDropdownSetStateName(e)}
                label="Users"
                value={this.state.patient_id}
                required
              >
                {this.createSelectItemsUser()}
              </Input>
            </div>
            <div className="form-group">
              <label htmlFor="Programs">Programs</label>
              <Input
                name="program_id"
                type="select"
                onChange={(e) => this.onDropdownSetStateName(e)}
                label="Programs"
                value={this.state.program_id}
                required
              >
                {this.createSelectItemsPrograms()}
              </Input>
            </div>
            <div className="form-group">
              <label htmlFor="purpose">Session</label>
              <Input
                name="purpose"
                type="number"
                name="purpose"
                value={this.state.purpose}
                onChange={(e) => this.onDropdownSetStateName(e)}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(event) => this.createList(event)}>
              Create
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          className="modal-lg"
          isOpen={this.state.modal1}
          toggle={this.toggle1}
        >
          <ModalHeader toggle={this.toggle1}>Assign Session</ModalHeader>
          <ModalBody>
            <Row>
              <Col xl={5}>
                <div className="form-group">
                  <h4>Patient :</h4>
                </div>
              </Col>
              <Col xl={7}>
                <div className="form-group">
                  <h4>{this.get_user_name(this.state.userID)}</h4>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={5}>
                <div className="form-group">
                  <h4>Program :</h4>
                </div>
              </Col>
              <Col xl={7}>
                <div className="form-group">
                  <h4>{this.get_program_name(this.state.programeID)}</h4>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={5}>
                <div className="form-group">
                  <h4>Session :</h4>
                </div>
              </Col>
              <Col xl={7}>
                <div className="form-group">
                  <h4>{this.state.session}</h4>
                </div>
              </Col>
            </Row>

            <hr />
            {this.generateRow(this.state.session)}

            {/* <div className="form-group">
              <label htmlFor="user">Patient</label>

            </div>
            <div className="form-group">
              <label htmlFor="Doctors">Programe</label>
            </div>
            <div className="form-group">
              <label htmlFor="Date">Session</label>
            </div> */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(event) => this.createList(event)}>
              Update
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle1}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // tests: state.test.tests,
  // paid_tests: state.test.paid_tests,
  users: state.auth.offline_users,
  doctors: state.auth.doctors,
  appoinments: state.appoinment.appoinments,
  appoinment: state.appoinment.appoinment,
  ordered_programs: state.program.ordered_programs,
  program: state.program.program,
  allProgram: state.program.allProgram,
});

export default withRouter(connect(mapStateToProps)(Programe));
