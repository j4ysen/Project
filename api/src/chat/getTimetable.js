import * as dynamodb from '../lib/dynamodb';
import { success, failure } from '../lib/response';

export const main = async (event, context, callback) => {
  const { pathParameters } = event;
  const params = {
    TableName: 'Chats',
    Key: {
      name: decodeURIComponent(pathParameters.getStream),
    },
  };
  console.log(pathParameters);
  try {
    const result = await dynamodb.call('get', params);
    console.log(result);
    callback(null, success(result.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
