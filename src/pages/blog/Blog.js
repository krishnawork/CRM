import React from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TableCard,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import s from "./Dashboard.module.scss";
import Widget from "../../components/Widget";
import stocksImg from "../../images/stocks.svg";
import {
  fetchBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../../actions/blog";
import ReactQuill from "react-quill";

class Counsellor extends React.Component {
  constructor() {
    super();
    this.state = {
      imageURLs: null,
      modal: false,
      title: "",
      description: "",
      imgUrl: null,
      selectedFile: "",
      editted: false,
      updateImage: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchBlogs());
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("state from props");
    if (nextProps.blog != null && prevState.editted == false) {
      return {
        title: nextProps.blog.title,
        description: nextProps.blog.description,
        editted: true,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  createBlog = (event) => {
    event.preventDefault();
    if (this.state.id == 0) {
      this.props.dispatch(
        createBlog({
          title: this.state.title,
          description: this.state.description,
          image: this.state.selectedFile,
          updateImage: this.state.updateImage,
        })
      );
    } else {
      this.props.dispatch(
        updateBlog({
          id: this.state.id,
          title: this.state.title,
          description: this.state.description,
          image: this.state.selectedFile,
          updateImage: this.state.updateImage,
        })
      );
      // window.location.reload();
    }
    this.props.dispatch(fetchBlogs());
    this.setState({
      modal: false,
      title: "",
      description: "",
      imgurl: "",
      updateImage: false,
      id: 0,
    });
    // window.location.reload();
  };

  onTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  onDescChange = (value) => {
    this.setState({ description: value });
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0], updateImage: true });
  };

  toggle = () => {
    this.setState({
      title: "",
      description: "",
      imgurl: "",
      updateImage: false,
      id: 0,
    });
    this.setState({ modal: !this.state.modal });
  };

  onEdit = (event, val) => {
    event.preventDefault();
    // this.props.dispatch(getBlog({id: id}));
    console.log(val);
    const mimeType = "image/png";
    const buffer = val.image;
    var url = "";
    if (buffer != null) {
      const b64 = new Buffer(buffer).toString("base64");
      url = `data:${mimeType};base64,${b64}`;
    }
    this.setState({
      id: val.id,
      modal: true,
      updateImage: false,
      title: val.title,
      description: val.description,
      imgUrl: url,
    });
  };

  onDelete = (event, id) => {
    event.preventDefault();
    if (window.confirm("Delete the item?")) {
      this.props.dispatch(deleteBlog({ id: id }));
    }
    // window.location.reload();
  };

  render() {
    const { error, loading, blogs, imageURLs, blog, imgURL } = this.props;
    console.log(blog);
    return (
      <div className={s.root}>
        <Row>
          <Col xl={4} style={{ paddingBottom: "10px" }}>
            <Button color="primary" onClick={this.toggle}>
              Create
            </Button>{" "}
          </Col>
        </Row>
        <Row>
          {blogs.map((blog) => (
            <Col style={{ paddingBottom: "10px" }} xl={4} key={blog.id}>
              <Card>
                <CardImg
                  top
                  width="100%"
                  height="270px"
                  src={
                    imageURLs.find((x) => x.id === blog.id) != undefined
                      ? imageURLs.find((x) => x.id === blog.id).url
                      : require("../../images/blog_default.png")
                  }
                  alt="Card image cap"
                />
                <CardBody>
                  <CardTitle tag="h5">{blog.title}</CardTitle>
                  <CardText
                    style={{
                      display: "-webkit-box",
                      maxWidth: "250px",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    ></div>
                  </CardText>
                  <div
                    style={{ justifyContent: "space-between", display: "flex" }}
                  >
                    {/* <Button>Read more..</Button> */}
                    <div>
                      <a onClick={(event) => this.onEdit(event, blog)}>
                        <img
                          src={require("../../images/edit.png")}
                          width="20"
                          height="25"
                        />
                      </a>
                      <a onClick={(event) => this.onDelete(event, blog.id)}>
                        <img
                          src={require("../../images/delete.png")}
                          width="40"
                          height="25"
                        />
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {this.state.id == 0 ? "Create New Blog" : "Edit Blog"}{" "}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Title</label>
              <input
                className="form-control"
                id="name"
                value={this.state.title}
                onChange={(event) => this.onTitleChange(event)}
              />
            </div>
            <label htmlFor="des">description</label>
            <ReactQuill
              value={this.state.description}
              onChange={this.onDescChange}
              style={{ marginBottom: "35px", width: "100%" }}
            />
            {/*this.state.imgUrl != null || this.state.imgUrl != '' ?
              <img src={this.state.imgUrl} width="100" height="100" />
            : '' */}
            <div className="form-group">
              <label htmlFor="image">Image : </label>
              <input
                type="file"
                id="image"
                onChange={(event) => this.onFileChange(event)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(event) => this.createBlog(event)}>
              {this.state.id == 0 ? "Create" : "Update"}
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  blogs: state.blog.items,
  imageURLs: state.blog.ary,
  loading: state.blog.loading,
  error: state.blog.error,
  blog: state.blog.blog,
  imgURL: state.blog.ary_url,
});

export default withRouter(connect(mapStateToProps)(Counsellor));
