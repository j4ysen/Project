import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from './PrivateRoute';
import App from './App';
import history from '../lib/history';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { authStatusChange } from '../actions/authActions';

export class RootRouter extends Component {
  componentWillMount() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.authStatusChange(true);
    } else {
      this.props.authStatusChange(false);
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route
            path="/register"
            exact
            component={Register}
          />
          <PrivateRoute authStatus={this.props.loggedIn} path="/" component={App} />
        </Switch>
      </Router>
    );
  }
}

RootRouter.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  authStatusChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  { loggedIn: state.auth.loggedIn }
);

export default connect(mapStateToProps, { authStatusChange })(RootRouter);
