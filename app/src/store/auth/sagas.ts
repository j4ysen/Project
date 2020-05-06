import { call, put, takeEvery } from 'redux-saga/effects';
import 'crypto-js/lib-typedarrays'; // add this line
import Amplify, { Auth, API, PubSub } from 'aws-amplify';
import { Alert } from 'react-native';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import {
    REQUEST_POSTS,
    RECEIVE_POSTS,
    FAIL_RECEIVE_POSTS,
    DELETE_POSTS,
    LOGIN, 
    REGISTER,
} from './actions';

import { Navigation } from 'react-native-navigation';
import { startApp, start } from '../../App';


async function fetchPostsApi(reddit: string) {
    const response = await fetch(`https://www.reddit.com/r/${reddit}.json`);
    return await response.json();
}


async function getUsers(){
        let apiName = 'gateway';
        let path = '/users'; 
        let myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {  // OPTIONAL
                body: { username: "alpha" }
            }
        }
        API.get(apiName, path, myInit).then(response => {
            // Add your code here
            console.log(response.data)
            // body: { username }
        }).catch(error => {
            console.log(error.response)
        });
}

async function getChats(){
    let apiName2 = 'gateway';
    let path2 = '/chats'; 
    let myInit2 = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {  // OPTIONAL
            // body: { username: "2test1" }
        }
    }
    API.get(apiName2, path2, myInit2).then(response => {
        // Add your code here
        console.log(response.data)
    }).catch(error => {
        console.log(error.response)
    });
}

async function addUser(username: string){
    let user = '/users'; 
    let user_gateway = 'gateway';
    let user_init = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        body: {
             username: username 
        }
        // queryStringParameters: {
        //     "alpha"
        // }
    }
    API.post(user_gateway, user, user_init).then(response => {
        // Add your code here
        console.log("Posted User: ", response.data)
    }).catch(error => {
        console.log(error.response)
    });
}
async function policy(){
        let attach_api = 'gateway';
        let publish = '/policy/publish'; 
        let recieve = '/policy/receive'; 
        let subscribe = '/policy/subscribe'; 
        let connect = '/policy/connect'; 
        let attach_myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {  // OPTIONAL
                // body: { username: "2test1" }
            }
        }
        API.post(attach_api, publish, attach_myInit).then(response => {
            // Add your code here
            console.log("publish", response.data)
        }).catch(error => {
            console.log(error.response)
        });

        API.post(attach_api, recieve, attach_myInit).then(response => {
            // Add your code here
            console.log("recieve", response.data)
        }).catch(error => {
            console.log(error.response)
        });

        API.post(attach_api, subscribe, attach_myInit).then(response => {
            // Add your code here
            console.log("subscribe", response.data)
        }).catch(error => {
            console.log(error.response)
        });

        API.post(attach_api, connect, attach_myInit).then(response => {
            // Add your code here
            console.log("connect", response.data)
        }).catch(error => {
            console.log(error.response)
        });
        // attachIotPolicy();

        Amplify.addPluggable(new AWSIoTProvider({
            aws_pubsub_region: 'eu-west-1',
            aws_pubsub_endpoint: 'wss://a2bxdw9aosrcvv-ats.iot.eu-west-1.amazonaws.com/mqtt',

          }));
}


function* fetchPosts({ subreddit }: RequestPostsAction) {
    try {
        const json = yield call(fetchPostsApi, subreddit);

        // SignIn('alpha3','Password1!');






        // PubSub.subscribe('stream/asdfghjk/+').subscribe({
        //     next: (data: any) => console.log('Message received', data),
        //     error: (error: any) => console.error(error),
        //     close: () => console.log('Done'),
        // });

        // let event_gateway = 'gateway';
        // // let event_path = '/event/' + encodeURIComponent("eu-west-1:90fda95b-4dcc-41a6-aadb-93ce767f21f8"); 1585228751030
        // let event_path = '/event/' + encodeURIComponent("1585228751030"); 
        // let event_params = { // OPTIONAL
        //     headers: {}, // OPTIONAL
        //     response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        //     queryStringParameters: {  // OPTIONAL
        //         // identityId:
        //         // body: {}
        //     }
        // }
        // API.get(event_gateway, event_path, event_params).then(response => {
        //     // Add your code here
        //     console.log(response.data)
        // }).catch(error => {
        //     console.log(error.response)
        // });

        // try{
        //     Auth.currentCredentials().then((info) => {
        //         console.log("Identity", info.identityId);
        //         PubSub.publish('stream/hello/'+info.identityId, { message: 'Corona3', identity: info.identityId, url: "stream/hello/+"});
        //     });
        // }
        // catch (e){
        //     console.log("error", e);
        // }

        yield put(receivePosts(subreddit, json));
    } catch (e) {
        yield put(failReceivePosts(subreddit, e));
    }
}


export const getCurrentCredentials = () => (
    new Promise((resolve, reject) => {
      Auth.currentCredentials()
        .then(creds => resolve(creds))
        .catch(error => reject(error));
    })
  );

export const attachIotPolicy = () => (
    new Promise((resolve, reject) => {
      getCurrentCredentials()
        .then((credentials) => {
          Amplify.addPluggable(new AWSIoTProvider({
            // ...config.pubSub,
            aws_pubsub_region: 'eu-west-1',
            aws_pubsub_endpoint: 'wss://a2bxdw9aosrcvv-ats.iot.eu-west-1.amazonaws.com/mqtt',
            credentials,
          }));
          resolve();
        })
        .catch((error) => {
          console.log('Error when getting credentials in order to attach an Iot policy', error);
          reject(error);
        });
        console.log("success");
    })
  );

async function fetchUser(_username: string,  _email: string, _password: string){
    try {
        console.log("Requesting login: ", _username, _email, _password);
        await Auth.signIn({username: _username, password: _password}); 
        // const user = await Auth.signIn({username: "test123", password: "Password1!"}); 
        Auth.currentCredentials().then((info) => {
            console.log("Identity", info.identityId);
        });
        startApp();
        
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            Alert.alert(err.message)
            console.log("Weird: ERR", err);
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            Alert.alert(err.message)
            console.log("Weird: ERR", err);
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            Alert.alert(err.message)
            console.log("Weird: ERR", err);
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            Alert.alert(err.message)
            console.log("Weird: ERR", err);
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            Alert.alert(err.message)
            console.log("ERR", err);
        }
    }
}
export async function SignIn({username, email, password}: LoginAction) {
    try{
        const user = fetchUser(username, email, password);
        console.log(user);
        //     Auth.currentCredentials().then((info) => {
        //         console.log("Identity", info.identityId);
        //         PubSub.publish('stream/hello/'+info.identityId, { message: 'Corona3', identity: info.identityId, url: "stream/hello/+"});
        //     });
        return user;
    } catch (e){
        console.log("Error: ",e);
    }
}

export function* loginHelper(){
    yield takeEvery<LoginAction>(LOGIN, SignIn)
}

async function signUpUser(_username: string,  _email: string, _password: string){
    try {
        console.log("Requesting SignUp: ", {_username, _email, _password});
        await Auth.signUp({
            username: _username, 
            password: _password,
            attributes: {
                email:_email,
            },
        }); 
        // const user = await Auth.signIn({username: "test123", password: "Password1!"}); 
        Auth.currentCredentials().then((info) => {
            console.log("Identity", info.identityId);
        });
        addUser(_username)
        Navigation.dismissAllModals();
        fetchUser(_username, _email, _password)
        startApp()

        
    } catch (err) {
        Alert.alert(err.message)
        console.log("ERR", err);
    }
}

export async function SignUp({username, email, password}: SignUpAction) {
    try{
        const user = signUpUser(username, email, password);
        console.log(user);
        return user;
    } catch (e){
        console.log("Error: ",e);
    }
}


export function* signupHelper(){
    yield takeEvery<SignUpAction>(REGISTER, SignUp)
}
