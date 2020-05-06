
import * as log from 'loglevel';

import IoTClient from './iot-client';
import Config from '../config';

export const initNewClient = (credentials) => {
  const options = {
    debug: Config.mqttDebugLevel,
    accessKeyId: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  };
  const client = new IoTClient(true, options);
  log.debug(client);
};

export const updateClientCredentials = (credentials) => {
  const { accessKeyId, secretAccessKey, sessionToken } = credentials;
  const client = new IoTClient();
  client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken);
};


export const unsubscribeFromTopics = (topics) => {
  const client = new IoTClient();
  topics.forEach((topic) => {
    client.unsubscribe(topic);
  });
};

export const attachMessageHandler = (handler) => {
  const client = new IoTClient();
  client.attachMessageHandler(handler);
};


export const attachConnectHandler = (onConnectHandler) => {
  const client = new IoTClient();
  client.attachConnectHandler(onConnectHandler);
};


export const attachCloseHandler = (handler) => {
  const client = new IoTClient();
  client.attachCloseHandler(handler);
};


export const publish = (topic, message) => {
  const client = new IoTClient();
  client.publish(topic, message);
  log.debug('published:', topic, message);
};

export const subscribe = (topic) => {
  const client = new IoTClient();
  client.subscribe(topic);
  log.debug('subscribed:', topic);

};

