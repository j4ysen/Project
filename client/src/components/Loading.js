import React from 'react';
import { Dimmer, Segment, Loader } from 'semantic-ui-react';

const styles = {
  segment: {
    height: '500px',
    marginTop: '2em',
  },
};

export const Loading = props => (
  <Segment style={styles.segment} size="massive">
    <Dimmer active inverted>
      <Loader size="massive">
        Loading...
      </Loader>
    </Dimmer>
  </Segment>
);


export default Loading;
