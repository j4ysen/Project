import * as dynamodb from '../lib/dynamodb';
import { success, failure, notFound } from '../lib/response';

export const main = async (event, context, callback) => {
  const params = {
    TableName: 'Users',
    Key: {
      identityId: event.requestContext.identity.cognitoIdentityId,
    },
  };

  try {
    const result = await dynamodb.call('get', params);
    if (result.Item) {
      callback(null, success(result.Item));
    } else {
      callback(null, notFound({ status: false, error: 'Could not find user' }));
    }
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
