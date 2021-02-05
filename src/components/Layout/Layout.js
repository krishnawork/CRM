import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Hammer from "rc-hammerjs";

import Dashboard from "../../pages/dashboard";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  openSidebar,
  closeSidebar,
  toggleSidebar,
} from "../../actions/navigation";
import s from "./Layout.module.scss";
import BreadcrumbHistory from "../BreadcrumbHistory";

// pages
import Typography from "../../pages/typography";
import Counsellor from "../../pages/counsellor/Counsellor";
import Blog from "../../pages/blog/Blog";
import Doctor from "../../pages/doctor/Doctor";
import Patient from "../../pages/patient/Patient";
import Staff from "../../pages/staff/Staff";
import Appoiment from "../../pages/appoiment/Appoiment";
import Programe from "../../pages/programe/Programe";
import Billing from "../../pages/billing/Billing";
import Payment from "../../pages/payment/Payment";
import Test from "../../pages/test/Test";
import Maps from "../../pages/maps";
import Notifications from "../../pages/notifications/Notifications";
import Icons from "../../pages/icons";
import Tables from "../../pages/tables";
import Charts from "../../pages/charts";
import ChatBoard from "../../pages/ChatBoard/ChatBoard";

import ReportGenerator from "../../reportGenerator";
import Progress from "../../pages/Progress/Progress";

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
  };

  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleCloseSidebar = this.handleCloseSidebar.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.props.dispatch(toggleSidebar());
    } else if (window.innerWidth >= 768) {
      this.props.dispatch(openSidebar());
    }
  }

  handleCloseSidebar(e) {
    if (
      e.target.closest("#sidebar-drawer") == null &&
      this.props.sidebarOpened &&
      window.innerWidth <= 768
    ) {
      this.props.dispatch(toggleSidebar());
    }
  }

  handleSwipe(e) {
    if ("ontouchstart" in window) {
      if (e.direction === 4) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }
    }
  }

  render() {
    return (
      <div
        className={[
          s.root,
          !this.props.sidebarOpened ? s.sidebarClose : "",
          "flatlogic-one",
          "dashboard-light",
        ].join(" ")}
        onClick={(e) => this.handleCloseSidebar(e)}
      >
        <Sidebar />
        <div className={s.wrap}>
          <Header />

          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <BreadcrumbHistory url={this.props.location.pathname} />
              <div style={{ marginTop: "20px" }}></div>
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                    <Route
                      path="/app/main"
                      exact
                      render={() => <Redirect to="/app/main/counsellor" />}
                    />
                    <Route
                      path="/app/main/dashboard"
                      exact
                      component={Dashboard}
                    />
                    <Route
                      path="/app/main/counsellor"
                      exact
                      component={Counsellor}
                    />
                    <Route path="/app/main/blog" exact component={Blog} />
                    <Route path="/app/main/doctor" exact component={Doctor} />
                    <Route path="/app/main/patient" exact component={Patient} />
                    <Route path="/app/main/staff" exact component={Staff} />
                    <Route
                      path="/app/main/appointment"
                      exact
                      component={Appoiment}
                    />
                    <Route
                      path="/app/main/program"
                      exact
                      component={Programe}
                    />
                    <Route path="/app/main/billing" exact component={Billing} />
                    <Route path="/app/main/payment" component={Payment} />
                    <Route path="/app/main/test" exact component={Test} />

                    <Route
                      path="/app/main/chatBoard"
                      exact
                      component={ChatBoard}
                    />
                    <Route
                      path={"/app/main/progress"}
                      exact
                      component={Progress}
                    />
                    <Route path={"/app/typography"} component={Typography} />
                    <Route path={"/app/tables"} component={Tables} />
                    <Route path={"/app/ui/maps"} component={Maps} />
                    <Route
                      path={"/app/ui/notifications"}
                      component={Notifications}
                    />
                    <Route path={"/app/ui/icons"} component={Icons} />
                    <Route path={"/app/ui/charts"} component={Charts} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
