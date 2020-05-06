import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import * as log from 'loglevel';

import Config from '../config';

const userPool = new CognitoUserPool({
  UserPoolId: Config.awsCognitoUserPoolId,
  ClientId: Config.awsCognitoUserPoolAppClientId,
});

const getCurrentUser = () => userPool.getCurrentUser();

const getUserToken = currentUser => (
  new Promise((resolve, reject) => {
    currentUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  })
);

export const retrieveAwsCreds = (token, provider) => (
  new Promise((resolve, reject) => {
    let providerKey = '';

    switch (provider) {
      case 'user_pool':
        providerKey = `cognito-idp.${Config.awsRegion}.amazonaws.com/${Config.awsCognitoUserPoolId}`;
        break;
      default:
        break;
    }

    AWS.config.region = Config.awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Config.awsCognitoIdentityPoolId,
      Logins: {
        [providerKey]: token,
      },
    });

    AWS.config.credentials.get((error) => {
      if (error) {
        reject(error);
      }

      const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
      const credentialSubset = { accessKeyId, secretAccessKey, sessionToken };
      resolve(credentialSubset);
    });
  })
);

const buildUserObject = username => (
  new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.getSession((sessionErr) => {
      if (sessionErr) {
        reject(sessionErr);
      }

      cognitoUser.getUserAttributes((err, result) => {
        if (err) {
          reject(err);
        }

        const user = {};
        for (let i = 0; i < result.length; i += 1) {
          user[result[i].getName()] = result[i].getValue();
        }
        user.username = username;
        resolve(user);
      });
    });
  })
);


const authenticateUser = (username, password) => (
  new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (error) => {
        reject(error);
      },
    });
  })
);

export const authorize = async () => {
  if (AWS.config.credentials && Date.now() < AWS.config.credentials.expireTime - 75000) {
    return true;
  }

  const provider = sessionStorage.getItem('provider');
  let token = sessionStorage.getItem('providerToken');
  switch (provider) {
    case 'user_pool': {
      const currentUser = getCurrentUser();
      token = await getUserToken(currentUser);
      break;
    }
    default:
      return false;
  }
  await retrieveAwsCreds(token, provider);
  return true;
};

export const getIdentityId = () => {
  const identityId = AWS.config.credentials.identityId;
  log.debug('principal', identityId);
  return identityId;
};

export const clearCachedId = () => {
  AWS.config.credentials.clearCachedId();
};

export const login = (username, password) => (
  new Promise((resolve, reject) => {
    authenticateUser(username, password).then((cognitoUserSession) => {
      const token = cognitoUserSession.getIdToken().getJwtToken();
      const promise1 = retrieveAwsCreds(token, 'user_pool');
      const promise2 = buildUserObject(username);
      return Promise.all([promise1, promise2]);
    }).then((values) => {
      const credentials = values[0];
      const user = values[1];
      const userData = Object.assign({ credentials }, { userObj: user });
      resolve(userData);
    }).catch((err) => {
      log.error(err);
      reject(err);
    });
  })
);


export const logout = () => (
  new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      log.debug('Signing out of cognito');
      cognitoUser.signOut();
    } else {
      log.debug('Signing out of cognito federated user');
    }
    resolve();
  })
);

export const register = (username, password, email) => (
  new Promise((resolve, reject) => {
    const attributeList = [];
    const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: email });
    attributeList.push(attributeEmail);
    userPool.signUp(username, password, attributeList, null, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.user.getUsername());
      }
    });
  })
);
