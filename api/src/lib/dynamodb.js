import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });

export const call = (action, params) => {
  return new AWS.DynamoDB.DocumentClient()[action](params).promise();
};
