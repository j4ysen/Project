import AWS from 'aws-sdk';

export const attachPrincipalPolicy = (policyName, principal) => {
  return new AWS.Iot().attachPrincipalPolicy({ policyName, principal }).promise();
};

export const createPolicy = (policyDocument, policyName) => {
  return new AWS.Iot().createPolicy({ policyDocument, policyName }).promise();
};
