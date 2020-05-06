import * as iot from '../lib/aws-iot';
import { success, failure } from '../lib/response';

export const main = async (event, context, callback) => {
  const principal = event.requestContext.identity.cognitoIdentityId;

  try {
    await iot.attachPrincipalPolicy('SubscribePolicy', principal);
    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, error: e }));
  }
};
