import * as dynamodb from '../lib/dynamodb';
import { success, failure } from '../lib/response';

export const main = async (event, context, callback) => {
  const params = {
    TableName: 'Chats',
  };

  try {
    const result = await dynamodb.call('scan', params);
    callback(null, success(result.Items));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
