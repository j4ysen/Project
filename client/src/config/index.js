 
import config from './config.json';

export default {
  awsIotHost: config.AwsIotHost,
  awsRegion: config.AwsRegion,
  awsCognitoUserPoolId: config.UserPoolId,
  awsCognitoUserPoolAppClientId: config.UserPoolClientId,
  awsCognitoIdentityPoolId: config.IdentityPoolId,
  awsApiGatewayInvokeUrl: config.AwsApiGatewayInvokeUrl,
  logLevel: config.LogLevel,
  mqttDebugLevel: config.MqttDebugLevel,
};
