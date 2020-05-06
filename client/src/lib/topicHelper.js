import * as log from 'loglevel';

export const topicFromParams = params => `stream/${params.streamIdentifier}`;

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);


export const formatStreamCardHeader = (streamIdentifier) => {
  if (!/^stream\/[a-zA-Z-1-9]+$/.test(streamIdentifier)) {
    log.error('Invalid topic. Expected /^stream/(public|private)/[a-zA-Z-1-9]+$/');
  }
  const streamIdentifierEnding = streamIdentifier.split('/').pop();
  
  const segments = streamIdentifierEnding.split('-').map(segment => capitalize(segment));
  
  return segments.join(' ');
  
};

export const identityIdFromNewMessageTopic = (topic) => {
  if (!/^stream\/[a-zA-Z-1-9]+\/[\w-]+:[0-9a-f-]+$/.test(topic)) {
    log.error('Invalid topic name');
  }
  return topic.substr(topic.lastIndexOf('/') + 1);
};


export const streamFromNewMessageTopic = (topic) => {
  if (!/^stream\/[a-zA-Z-1-9]+\/[\w-]+:[0-9a-f-]+$/.test(topic)) {
    log.error('Invalid new message');
  }
  return topic.substr(0, topic.lastIndexOf('/'));
};

export const topicFromSubscriptionTopic = (topic) => {
  if (!/^stream\/[a-zA-Z-1-9]+\/\+$/.test(topic)) {
    log.error('Invalid subscription topic');
  }
  return topic.substr(0, topic.lastIndexOf('/'));
};
