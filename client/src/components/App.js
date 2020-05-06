import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Switch, Route } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Streams from './Streams/Streams';
import Location from './Location/Location';
import Loading from './Loading';
import { handleSignOut, authStatusChange } from '../actions/authActions';
import * as IoT from '../lib/aws-iot';
import { fetchPolicies, deviceStatus, attachMessageHandler } from '../actions/locationActions';
import RootRouter from './RootRouter';

const styles = {
  container: {
    marginTop: '7em',
  },
};

/**
 * Entry component to the authenticated portion of the app
 */
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterApp: false,
    };
    this.signOut = this.signOut.bind(this);
  }

  componentWillMount() {
    this.validateUserSession();
  }

  componentDidMount() {
    const connectCallback = () => this.props.deviceStatus(true);
    const closeCallback = () => this.props.deviceStatus(false);
    this.props.fetchPolicies(connectCallback, closeCallback);
  }

  componentWillReceiveProps(nextProps) {
    const {
      connectPolicy,
      publishPolicy,
      subscribePolicy,
      receivePolicy,
      deviceConnected,
      identityId,
    } = nextProps;

    if (connectPolicy &&
      publishPolicy &&
      subscribePolicy &&
      receivePolicy &&
      deviceConnected) {
      // Ping to test connection
      const topic = `stream/ping/${identityId}`;
      IoT.publish(topic, JSON.stringify({ message: 'connected', identity: identityId, url: topic}));
      // Attach message handler if not yet attached
      this.props.attachMessageHandler();
      this.setState({
        enterApp: true,
      });
    }
  }

  validateUserSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.authStatusChange(true);
    } else {
      this.props.authStatusChange(false);
    }
  }

  signOut(e) {
    e.preventDefault();
    this.props.handleSignOut();
  }

  renderBody() {
    // If we have fetchd the necessary policies, render desired page
    if (this.state.enterApp) {
      
      return (
        <Container style={styles.container}>
          <Switch>
            <Route path="/app/stream/:streamIdentifier" component={Location} />
            <Route exact path="/app/streams" component={Streams} />
            <Route path="/" component={Streams} />
          </Switch>
        </Container>
      );
    }

    // Otherwise display a loading spinner until API calls have succeeded
    return (
      <Route
        path="/"
        component={Loading}
      />
    );
  }

  render() {
    if (!this.props.loggedIn) {
      return (<RootRouter />);
    }
    else{
      return (
        <div>
          <Menu secondary
            fixed="top"
          >
            <Menu.Item><Link to="/app/streams">Streams</Link></Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item onClick={this.signOut}>Log out</Menu.Item>
            </Menu.Menu>
          </Menu>
          { this.renderBody() }
        </div>
      );
    }
  }
}

App.propTypes = {
  handleSignOut: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  authStatusChange: PropTypes.func.isRequired,
  fetchPolicies: PropTypes.func.isRequired,
  connectPolicy: PropTypes.bool.isRequired,
  publishPolicy: PropTypes.bool.isRequired,
  subscribePolicy: PropTypes.bool.isRequired,
  receivePolicy: PropTypes.bool.isRequired,
  deviceConnected: PropTypes.bool.isRequired,
  deviceStatus: PropTypes.func.isRequired,
  identityId: PropTypes.string.isRequired,
  attachMessageHandler: PropTypes.func.isRequired,
};

const mapStateToProps = (state => ({
  loggedIn: state.auth.loggedIn,
  connectPolicy: state.location.connectPolicy,
  publishPolicy: state.location.publishPolicy,
  subscribePolicy: state.location.subscribePolicy,
  receivePolicy: state.location.receivePolicy,
  deviceConnected: state.location.deviceConnected,
  identityId: state.auth.identityId,
}));

const mapDispatchToProps = {
  handleSignOut,
  authStatusChange,
  fetchPolicies,
  deviceStatus,
  attachMessageHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
