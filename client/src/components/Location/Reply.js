import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { messageValueChanged } from '../../actions/chatActions';
import * as IoT from '../../lib/aws-iot';

/*
 * Component to render the reply section of a chat stream
 */
export class Reply extends Component {
  constructor(props) {
    super(props);
    this.onMessageChange = this.onMessageChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onMessageChange(event, result) {
    const { value: msg } = result;
    this.props.messageValueChanged(msg);
  }

  onFormSubmit() {
    const { messageValue, identityId, match } = this.props;
    const msg_object = { message: messageValue, identity: identityId, url: match['url']};
    this.props.messageValueChanged('');
    const topic = `stream/${match.params}/${identityId}`;
    
    IoT.publish(topic, JSON.stringify(msg_object));
  }

  render() {
    return (
      <Form onSubmit={this.onFormSubmit} >
        <Form.Group>
          <Form.Field>
            <Form.Input
              placeholder="message"
              value={this.props.messageValue}
              onChange={this.onMessageChange}
            />
          </Form.Field>
          <Button
            type="submit"
            disabled={this.props.messageValue === ''}>
            Send
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

Reply.propTypes = {
  messageValue: PropTypes.string.isRequired,
  messageValueChanged: PropTypes.func.isRequired,
  identityId: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      streamIdentifier: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  messageValue: state.chat.messageValue,
  identityId: state.auth.identityId,
});

export default withRouter(connect(mapStateToProps, { messageValueChanged })(Reply));
