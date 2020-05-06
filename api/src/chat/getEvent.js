import * as dynamodb from '../lib/dynamodb';
import { success, failure } from '../lib/response';

export const EVENT_ALREADY_EXISTS = 'Event already exists.';

export const main = async (event, context, callback) => {
  const { pathParameters } = event;
  const params = {
    TableName: 'Events',
    FilterExpression: 'payload_url = :payload_url',
    ExpressionAttributeValues: {
      ':payload_url': decodeURIComponent(pathParameters.getUrl),
    },
  };
  console.log(event, context, callback);

  try {
    const result = await dynamodb.call('scan', params);
    if (result.Items) {
      const sorted = result.Items.sort((a, b) => ((a.createdAt > b.createdAt) ? 1 : -1));
      callback(null, success(sorted));
    } else {
      console.log(result);
      callback(null, failure({ status: false, error: EVENT_ALREADY_EXISTS }));
    }
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
