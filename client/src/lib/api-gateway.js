import AWS from 'aws-sdk';
import * as log from 'loglevel';

import Config from '../config';
import { authorize } from './aws-cognito';
import sigV4Client from './sigV4Client';

export const invokeAPIGateway = async ({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body,
}) => {
  if (!await authorize()) {
    throw new Error('Login failed');
  }

  const client = sigV4Client.newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: Config.awsRegion,
    endpoint: Config.awsApiGatewayInvokeUrl,
  });

  const signedRequest = client.signRequest({
    method,
    path,
    headers,
    queryParams,
    body,
  });

  const signedBody = body ? JSON.stringify(body) : body;
  const signedHeaders = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers: signedHeaders,
    body: signedBody,
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
};

export const connect = async () => {
  try {
    await invokeAPIGateway({
      path: '/policy/connect',
      method: 'POST',
      body: {},
    });
  } catch (error) {
    log.error(error);
  }
};

export const publish = async () => {
  try {
    await invokeAPIGateway({
      path: '/policy/publish',
      method: 'POST',
      body: {},
    });
  } catch (error) {
    log.error(error);
  }
};

export const subscribe = async () => {
  try {
    await invokeAPIGateway({
      path: '/policy/subscribe',
      method: 'POST',
      body: {},
    });
  } catch (error) {
    log.error(error);
  }
};

export const receive = async () => {
  try {
    await invokeAPIGateway({
      path: '/policy/receive',
      method: 'POST',
      body: {},
    });
  } catch (error) {
    log.error(error);
  }
};

export const createUser = async (username) => {
  let result;
  try {
    result = await invokeAPIGateway({
      path: '/users',
      method: 'POST',
      body: { username },
    });
  } catch (error) {
    log.error(error);
  }
  return result;
};

export const fetchUser = async (identityId) => {
  const result = await invokeAPIGateway({
    path: `/users/${encodeURIComponent(identityId)}`,
    method: 'GET',
  });

  return result;
};


export const fetchChatHistory = async (identityId) => {
  const result = await invokeAPIGateway({
    path: `/event/${encodeURIComponent(identityId)}`,
    method: 'GET',
  });

  return result;
};

export const fetchAllChats = async () => {
  const result = await invokeAPIGateway({
    path: '/chats',
    method: 'GET',
  });

  return result;
};


export const fetchTimetableChats = async (identityId) => {
  const result = await invokeAPIGateway({
    path: `/getTimetable/${encodeURIComponent(identityId)}`,
    method: 'GET',
  });
  console.log("RESULT", result)
  return result;
};


export const setTimetableChats = async (timetable, identityId) => {
  let result;
  try {
    result = await invokeAPIGateway({
      path: `/setTimetable/${encodeURIComponent(identityId)}`,
      method: 'POST',
      body: {timetable},
    });
  } catch (error) {
    log.error(error);
  }
  return result;
};


export const createChat = async (streamIdentifier) => {
  const result = await invokeAPIGateway({
    path: '/chats',
    method: 'POST',
    body: {
      streamIdentifier,
    },
  });

  return result;
};

