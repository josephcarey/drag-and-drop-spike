// React
import React, { Component } from "react";

// React Routing
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// Redux
import { connect } from "react-redux";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Nav from "../Nav/Nav";
import ViewPagePicker from "../ViewPagePicker/ViewPagePicker";
import TestDnD from "../TestDnD/TestDnD";

// Material-UI
import {
  CssBaseline,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core";
import { blueGrey, pink } from "@material-ui/core/colors/";

const theme = createMuiTheme({
  palette: {
    // type: "dark",
    primary: blueGrey,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: "FETCH_USER" });
    this.props.dispatch({ type: "FETCH_EVENT_LIST" });
  }

  render() {
    return (
      <Router>
        <div>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Nav />
            <Switch>
              {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
              {/* <Redirect exact from="/" to="/home" /> */}
              {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
              {/* <Route exact path="/about" component={AboutPage} /> */}
              {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
              {/* <ProtectedRoute exact path="/home" component={ViewPagePicker} /> */}
              {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
              {/* If none of the other routes matched, we will show a 404. */}
              <Route render={() => <TestDnD />} />
            </Switch>
            {/* <Footer /> */}
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

export default connect()(App);
