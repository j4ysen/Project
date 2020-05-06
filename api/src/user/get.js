import * as dynamodb from '../lib/dynamodb';
import { success, failure, notFound } from '../lib/response';

/**
 * Query user by their CognitoId
 */
export const main = async (event, context, callback) => {
  const { pathParameters } = event;
  const params = {
    TableName: 'Users',
    Key: {
      identityId: decodeURIComponent(pathParameters.identityId),
    },
  };

  try {
    const result = await dynamodb.call('get', params);
    if (result.Item) {
      callback(null, success(result.Item));
    } else {
      callback(null, notFound({ status: false, error: "Couldn't find user" }));
    }
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
