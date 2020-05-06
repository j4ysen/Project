 
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Message from './Message';
import { topicFromParams } from '../../lib/topicHelper';

export const History = ({ messages, fetchingUser }) => (
  <Comment.Group>
    <Header as="h3" dividing>Message History</Header>
    {messages.map(message => (
      <Message
        key={message.id}
        {...message}
      />
    ))}
    <Comment
      collapsed={!fetchingUser}
    >
      <Comment.Content>
        <Comment.Text>Loading Sender...</Comment.Text>
      </Comment.Content>
    </Comment>
  </Comment.Group>
);


History.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  
  fetchingUser: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  
  const topic = topicFromParams(ownProps.match.params);
  const stream = state.streams[topic];
  console.log( stream ? stream.messages : [])
  return {
    messages: stream ? stream.messages : [],
    fetchingUser: state.chat.fetchingUser,
  };
};

export default withRouter(connect(mapStateToProps)(History));
