 
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import topicFromParams from '../../lib/topicHelper'
import Message from './Message';

/**
 * Presentational component to render the list of messages
 */
export const Validate = ({ messages, streamN, fetchingUser }) => (
  <Comment.Group>
    <Header as="h3" dividing>Event History {streamN} </Header>
    {messages.map(message => {
      
      //Logic
      if(message.body.includes("longitude"))  
        return "YES"
        // return <Message
        // key={message.id}
        // {...message}
        // />
    })}
    <Comment
      collapsed={!fetchingUser}
    >
      <Comment.Content>
        <Comment.Text>Loading Sender...</Comment.Text>
      </Comment.Content>
    </Comment>
  </Comment.Group>
);


Validate.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  fetchingUser: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  // console.log("History State: ", state);
  const topic = `stream/${ownProps.match.params}`;
  const stream = state.streams[topic];
  console.log( stream ? stream.messages : [])
  return {
    messages: stream ? stream.messages : [],
    fetchingUser: state.chat.fetchingUser,
  };
};

export default withRouter(connect(mapStateToProps)(Validate));
