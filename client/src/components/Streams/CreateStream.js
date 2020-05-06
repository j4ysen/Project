 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { createChat } from '../../actions/chatActions';

export class CreateStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      streamIdentifier: 'sharable-stream-name',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sanitizestreamIdentifier = this.sanitizestreamIdentifier.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { streamIdentifier, type } = this.state;
    this.props.createChat(streamIdentifier, type);
  }

  onChange(e, { name, value }) {
    this.setState({ [name]: value });
    if (name === 'name') {
      this.sanitizestreamIdentifier(value);
    }
  }

  sanitizestreamIdentifier(name) {
    let streamIdentifier = name.replace(/[^a-zA-Z 1-9]/g, '').replace(/\s\s+/g, ' ').toLowerCase().replace(/ /g, '-');
    this.setState({ streamIdentifier });
  }

  render() {
    return (
      <List.Item>
        <List.Content>
          <List.Header>
            New Stream
          </List.Header>
        </List.Content>
        <List.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <Form.Input
                placeholder="name"
                id="stream_name"
                name="name"
                onChange={this.onChange}
              />
            </Form.Field>
            <Form.Field>
              <div >
                {this.state.streamIdentifier}
              </div>
            </Form.Field>
            <Form.Button
              fluid
              color="teal"
              loading={this.props.creatingChat}
            >
              Create
            </Form.Button>
          </Form>
        </List.Content>
      </List.Item>
    );
  }
}

CreateStream.propTypes = {
  createChat: PropTypes.func.isRequired,
  creatingChat: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  creatingChat: state.chat.creatingChat,
});

export default connect(mapStateToProps, { createChat })(CreateStream);
