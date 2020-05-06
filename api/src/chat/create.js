import * as dynamodb from '../lib/dynamodb';
import { success, failure, badRequest } from '../lib/response';

export const main = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const tableName = 'Chats';
  const identityId = event.requestContext.identity.cognitoIdentityId;
  const { streamIdentifier } = data;

  if (!/^stream\/[a-zA-Z-1-9]+$/.test(streamIdentifier)) {
    callback(null, badRequest({ status: false, error: 'The supplied format was incorrect, it must follow /stream/XXX+' }));
    return;
  }

  const params = {
    TableName: tableName,
    Item: {
      admin: identityId,
      name: streamIdentifier,
      createdAt: new Date().getTime(),
      timetables: [],
    },
  };

  const queryParams = {
    TableName: tableName,
    Key: {
      name: streamIdentifier,
    },
  };

  try {
    const oldItem = await dynamodb.call('get', queryParams);
    if (oldItem.Item) {
      callback(null, badRequest({ status: false, error: 'This stream already exists' }));
      return;
    }
    await dynamodb.call('put', params);
    const result = await dynamodb.call('get', queryParams);
    callback(null, success(result.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
