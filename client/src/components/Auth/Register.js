 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, List, Message, Divider, Segment, Container, Form, Header, Popup, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { register, formChange } from '../../actions/authActions';

const styles = {
  container: {
    marginTop: '7em',
  },
};

export class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password, email } = this.props;
    this.props.register(username, password, email);
  }

  handleChange(e, { name, value }) {
    this.props.formChange(name, value);
  }

  render() {
    const {
      username,
      password,
      email,
      error,
      notice,
      loading,
    } = this.props;

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
              value={username}
              name="username"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Popup
            trigger={
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
            }
            position="bottom left"
            flowing
          >
            <List bulleted>
              <List.Item>Password must have at least 1 number</List.Item>
              <List.Item>Password must have at least 1 special character</List.Item>
              <List.Item>Password must have at least 1 uppercase letter</List.Item>
              <List.Item>Password must have at least 1 lowercase letter</List.Item>
            </List>
          </Popup>
          <Form.Field>
            <Form.Input
              label="Email"
              placeholder="email"
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Field>

              <Button color='teal' fluid size='large' type="submit" onClick={this.handleSubmit}>
              Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Have an account? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
      </Container>



    );
  }
}


Register.propTypes = {
  register: PropTypes.func.isRequired,
  formChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  notice: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ auth }) => {
  const {
    username,
    password,
    email,
    error,
    notice,
    loading,
  } = auth;
  return {
    username,
    password,
    email,
    error,
    notice,
    loading,
  };
};

export default connect(mapStateToProps, { formChange, register })(Register);
