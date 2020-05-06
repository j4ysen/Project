// I am not the original creator of this file - Jaysen Munsami
// https://github.com/avepha/sg-web-aws/blob/a74e427b8f2154f2ce68a55e1eea45083a45c074/src/modules/lib/iot-client.js

import DeviceSdk from 'aws-iot-device-sdk';
import * as log from 'loglevel';

import Config from '../config';

let instance = null;

export default class IoTClient {

  constructor(createNewClient = false, options = {}) {
    if (createNewClient && instance) {
      instance.disconnect();
      instance = null;
    }

    if (instance) {
      return instance;
    }
    instance = this;
    this.initClient(options);
    this.attachDebugHandlers();
  }

  /**
   * Instantiate AWS IoT device object
   * Note that the credentials must be initialized with empty strings;
   * When we successfully authenticate to the Cognito Identity Pool,
   * the credentials will be dynamically updated.
   *
   * @params {Object} options - Options to pass to DeviceSdk
   */
  initClient(options) {
    const clientId = `chat-user-${Math.floor((Math.random() * 1000000) + 1)}`;

    this.client = DeviceSdk.device({
      region: options.region || Config.awsRegion,

      // AWS IoT Host endpoint
      host: options.host || Config.awsIotHost,

      // clientId created earlier
      clientId: options.clientId || clientId,

      // Connect via secure WebSocket
      protocol: options.protocol || 'wss',

      // Set the maximum reconnect time to 500ms; this is a browser application
      // so we don't want to leave the user waiting too long for reconnection after
      // re-connecting to the network/re-opening their laptop/etc...
      baseReconnectTimeMs: options.baseReconnectTimeMs || 250,
      maximumReconnectTimeMs: options.maximumReconnectTimeMs || 500,

      // Enable console debugging information
      debug: (typeof options.debug === 'undefined') ? true : options.debug,

      // AWS access key ID, secret key and session token must be
      // initialized with empty strings
      accessKeyId: options.accessKeyId || '',
      secretKey: options.secretKey || '',
      sessionToken: options.sessionToken || '',

      // Let redux handle subscriptions
      autoResubscribe: (typeof options.debug === 'undefined') ? false : options.autoResubscribe,
    });
  }

  /**
   * Disconnect client
   */
  disconnect() {
    this.client.end();
  }

  /**
   * Attach reconnect, offline, error, message debug handlers
   */
  attachDebugHandlers() {
    this.client.on('reconnect', () => {
      log.debug('reconnect');
    });

    this.client.on('offline', () => {
      log.debug('offline');
    });

    this.client.on('error', (err) => {
      log.debug('iot client error', err);
    });

    this.client.on('message', (topic, message) => {
      log.debug('new message', topic, JSON.parse(message.toString()));
    });
  }

  /**
   * Update device client with AWS identity credentials after logging in.
   *
   * @param {string} accessKeyId - Access Key Id
   * @param {string} secretAccessKey - Secret Access Key
   * @param {string} sessionToken - Session Token
   */
  updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken) {
    this.client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken);
  }

  /**
   * Attach a message handler
   *
   * @param {IoTClient~onMessageCallback} onNewMessageHandler - Callback that handles a new message
   * @callback IoTClient~onMessageCallback
   *
   * @param {string} topic - Message topic
   * @param {string} jsonPayload - Json encoded message payload
   */
  attachMessageHandler(onNewMessageHandler) {
    this.client.on('message', onNewMessageHandler);
  }

  /**
   * Attach a connect handler
   *
   * @param {IoTClient~onConnectHandler} onConnectHandler - Callback that handles a new connection
   *
   * @callback IoTClient~onConnectHandler
   * @param {Object} connack - Connack object
   */
  attachConnectHandler(onConnectHandler) {
    this.client.on('connect', (connack) => {
      log.debug('connected', connack);
      onConnectHandler(connack);
    });
  }

  /**
   * Attach a close handler
   *
   * @param {IoTClient~onCloseHandler} onCloseHandler - Callback that handles closing connection
   *
   * @callback IoTClient~onCloseHandler
   * @param {Object} err - Connection close error
   */
  attachCloseHandler(onCloseHandler) {
    this.client.on('close', (err) => {
      log.debug('close', err);
      onCloseHandler(err);
    });
  }

  /**
   * Publish to an MQTT topic
   *
   * @param {string} topic - Topic to publish to
   * @param {string} message - JSON encoded payload to send
   */
  publish(topic, message) {
    this.client.publish(topic, message);
    console.log(topic, message);
  }

  /**
   * Subscribe to an MQTT topic
   *
   * @param {string} topic - Topic to subscribe to
   */
  subscribe(topic) {
    this.client.subscribe(topic);
  }

  /**
   * Unsubscribe from MQTT topic
   *
   * @param {string} topic - Topic to unsubscribe from
   */
  unsubscribe(topic) {
    this.client.unsubscribe(topic);
    log.debug('unsubscribed from topic', topic);
  }
}
