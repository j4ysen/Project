import * as dynamodb from '../lib/dynamodb';
import { success, failure } from '../lib/response';


export const main = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const { pathParameters } = event;

  const params = {
    TableName: 'Chats',
    Key: {
      name: decodeURIComponent(pathParameters.setStream),
    },
  };

  const params2 = {
    TableName: 'Chats',
    Key: {
      name: decodeURIComponent(pathParameters.setStream),
    },
  };

  console.log(pathParameters);
  console.log(data);
  try {
    const result = await dynamodb.call('get', params);
    params2.Item = result.Item;
    params2.Item.timetables = data.timetable;

    const updated = await dynamodb.call('put', params2);
    callback(null, success(updated.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
