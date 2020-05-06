import * as iot from '../lib/aws-iot';
import { success, failure } from '../lib/response';

export const main = async (event, context, callback) => {
  const cognitoIdentity = event.requestContext.identity.cognitoIdentityId;

  const policyName = `PublishPolicy.${cognitoIdentity.split(':').join('-')}`;
  const principal = cognitoIdentity;

  const accountArn = context.invokedFunctionArn.split(':')[4];

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'iot:Publish',
        ],
        Resource: [
          `arn:aws:iot:${process.env.AWS_REGION}:${accountArn}:topic/stream/*/${principal}`,
        ],
      },
    ],
  };

  try {
    await iot.attachPrincipalPolicy(policyName, principal);
    await iot.createPolicy(JSON.stringify(policyDocument), policyName);
    callback(null, success({ status: true }));
  } catch (e) {
    if (e.statusCode === 409) {
      callback(null, success({ status: true }));
    } else {
      console.log(e);
      callback(null, failure({ status: false, error: e }));
    }
  }
};
