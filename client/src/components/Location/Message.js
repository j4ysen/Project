import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';
const Message = ({ author, time, body }) => (
  <Comment>
    <Comment.Content>
      <Comment.Author as="a">{author}</Comment.Author>
      <Comment.Metadata>
        <div>{moment(time).calendar()}</div>
      </Comment.Metadata>
      <Comment.Text>{body}</Comment.Text>
    </Comment.Content>
  </Comment>
);

Message.propTypes = {
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Message;
