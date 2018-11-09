import React, { Component } from "react";
import { connect } from "react-redux";

import MyBackButton from "../MyBackButton/MyBackButton";
import MyHeading from "../MyHeading/MyHeading";
import MySubHeading from "../MySubHeading/MySubHeading";
import MyList from "../MyList/MyList";
import MyCenterButton from "../MyCenterButton/MyCenterButton";

import ModalAddToRole from "../ModalAddToRole/ModalAddToRole";

class ViewFinalize extends Component {
  componentDidMount() {}

  getRoster = () => {
    this.props.dispatch({
      type: "FETCH_CONTEST_ROSTER",
      payload: this.props.selectedContest.id,
    });
  };

  backButton = () => {
    this.props.dispatch({
      type: "NAVIGATE_TO",
      payload: "selectContest",
    });
  };

  finalizeButton = () => {
    this.props.dispatch({
      type: "FINALIZE_CONTEST",
      payload: this.props.selectedContest.id,
    });
  };

  render() {
    return (
      <div>
        <MyBackButton onClick={this.backButton}>
          Back to contest list
        </MyBackButton>
        <MyHeading noTopHeader>Thanks!</MyHeading>
        <MySubHeading>{this.props.selectedContest.name}</MySubHeading>

        {/* <MySubHeading>Submitted:</MySubHeading>
        <MyList
          people
          list={this.props.contestRoster.judges}
          // handleClick={this.selectContest}
        /> */}

        <MyCenterButton fixed onClick={this.finalizeButton}>
          Finalize
        </MyCenterButton>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  selectedEvent: state.selectedEvent,
  selectedContest: state.selectedContest,
  contestRoster: state.contestRoster,
});

export default connect(mapStateToProps)(ViewFinalize);
