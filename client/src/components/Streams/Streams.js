 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Message, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fetchAllChats } from '../../actions/chatActions';
import StreamCard from './StreamsCard';
import CreateStream from './CreateStream';

export class stream extends Component {
  componentDidMount() {
    this.props.fetchAllChats();
  }

  render() {
    const { error, chats } = this.props;
    return (
      <div>
        <Header as="h1">Streams</Header>
        <Message
          warning
          header={error}
          hidden={error === ''}
        />
        <List divided relaxed>
          <CreateStream />
          {chats.map(chat => (<StreamCard key={chat.name} chat={chat} />))}
        </List>
      </div>
    );
  }
}

stream.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  fetchAllChats: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  chats: state.chat.allChats,
  error: state.chat.error,
});

export default connect(mapStateToProps, { fetchAllChats })(stream);
