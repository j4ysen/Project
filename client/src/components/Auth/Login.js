 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Container, Divider, Form, Message, Header, Segment, Grid, Image } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';

import {
  formChange,
  login,
  authStatusChange,
} from '../../actions/authActions';

const styles = {
  container: {
    marginTop: '7em',
  },
};

export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.validateUserSession();
  }

  handleSubmit() {
    const { username, password } = this.props;
    this.props.login(username, password);
  }

  handleChange(e, { name, value }) {
    this.props.formChange(name, value);
  }


  validateUserSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.authStatusChange(true);
    } else {
      this.props.authStatusChange(false);
    }
  }

  render() {
    const { error, loading, username, password, loggedIn, notice } = this.props;

    if (loggedIn) {
      const { from } = this.props.location.state || { from: { pathname: '/app' } };
      return (
        <Redirect to={from} />
      );
    }

    return (
      <Container style={styles.container}>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              {/* <Image src='/logo.png' />  */}
              Login
            </Header>
            <Form size='large' loading={loading}>
              <Segment stacked>
                <Message
                  info
                  header={notice}
                  hidden={notice === ''}
                />
                <Message
                  warning
                  header={error}
                  hidden={error === ''}
                />
                <Form.Field>
                  <Form.Input
                    label="Username"
                    placeholder="username"
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label="Password"
                    placeholder="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                </Form.Field>
      
                <Button color='teal' fluid size='large' type="submit" onClick={this.handleSubmit}>
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New? <Link to="/register">Sign Up Now</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

Login.propTypes = {
  formChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  notice: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  authStatusChange: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = ({ auth }) => {
  const { username, password, error, loading, loggedIn, notice } = auth;
  return { username, password, error, loading, loggedIn, notice };
};

export default connect(
  mapStateToProps,
  {
    formChange,
    login,
    authStatusChange,
  },
)(Login);
