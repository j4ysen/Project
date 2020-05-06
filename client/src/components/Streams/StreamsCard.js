 
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, List,  Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatStreamCardHeader } from '../../lib/topicHelper';

/**
 * Component on /app/rooms screen that renders a card that links to a stream
 */
export const StreamsCard = ({ chat, subscribed }) => (
  <List.Item as={Link} to={`/app/${chat.name}`}>
    <List.Icon name='location arrow' size='large' verticalAlign='middle' />
    <List.Content>
      <List.Header>
        { formatStreamCardHeader(chat.name) }
      </List.Header>
      { subscribed && 
        <List.Description extra>
        <Icon name="favorite" />
        Subscribed
        <br />
      </List.Description>}
    </List.Content>
  </List.Item>
);


StreamsCard.propTypes = {
  chat: PropTypes.shape({
    name: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
  subscribed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  subscribed: state.chat.subscribedTopics.includes(`${ownProps.chat.name}/+`),
});

export default connect(mapStateToProps)(StreamsCard);
