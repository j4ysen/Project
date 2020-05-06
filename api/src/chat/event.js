import moment from 'moment';
import * as dynamodb from '../lib/dynamodb';
import { success, failure } from '../lib/response';

export const main = async (event, context, callback) => {
  const tableName = 'Events';

  const params = {
    TableName: tableName,
    Key: {
      name: Date.now().toString(),
    },
    Item: {
      admin: event.identity,
      payload_url: event.url,
      name: Date.now().toString(),
      createdAt: new Date().getTime(),
      id: Date.now().toString(),
      timestamp: moment().format(),
      payload: event.message,
    },
  };

  console.log(event, context, callback);
  try {
    await dynamodb.call('put', params);
    const result = await dynamodb.call('get', params);
    callback(null, success(result.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
