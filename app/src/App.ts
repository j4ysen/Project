import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Amplify, { Auth, API, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

import aws_config from'./aws_config';

export const Login = 'AwesomeProject.Login';






import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent,
  DeviceSettings, DeviceSettingsRequest,
  Notification,
  DeviceInfo,
  Authorization, AuthorizationEvent,
  TransistorAuthorizationToken
} from "react-native-background-geolocation";

import { EMPTY, LOGIN, HOME2, LAND2 } from './screens';

// import HomeScreen from './screens/Home';
// import LandScreen from './screens/Land';
// import EmptyScreen from './screens/Empty';
import LoginScreen from './screens/Login';
// import Initialising from './screens/Initialising';
import HomeScreen2 from './screens/Home2';
import LandScreen2 from './screens/Land2';

import { withReduxProvider } from './store';
// import config from './aws_config';
import { getCurrentCredentials } from './store/auth/sagas';


const Screens = new Map<string, React.FC<any>>();

// Screens.set(HOME, HomeScreen);
// Screens.set(LAND, LandScreen);
// // Screens.set(EMPTY, EmptyScreen);
Screens.set(LOGIN, LoginScreen);
// Screens.set(INIT, Initialising);
Screens.set(HOME2, HomeScreen2);
Screens.set(LAND2, LandScreen2);

// Register screens
Screens.forEach((C, key) => {
    Navigation.registerComponent(
        key,
        () => gestureHandlerRootHOC(withReduxProvider(C)),
        () => C,
    );

    
});
type IProps = {
    navigation: any;
  }
  type IState = {
    appState: any,
    username?: string;
    enabled?: boolean;
    isMoving?: boolean;
    isMainMenuOpen?: boolean;
    isSyncing?: boolean;
    isEmailingLog?: boolean;
    isDestroyingLocations?: boolean;
    isPressingOnMap?: boolean;
    isResettingOdometer?: boolean;
    mapScrollEnabled?: boolean,
    showsUserLocation?: boolean,
    followsUserLocation?: boolean,
    tracksViewChanges?: boolean,
    motionActivity: MotionActivityEvent;
    odometer?: string;
    centerCoordinate?: any;
    stationaryLocation?: any;
    stationaryRadius?: number;
    markers?: any;
    stopZones?: any;
    geofences?: any;
    geofencesHit?: any;
    geofencesHitEvents?: any;
    coordinates?: any,
    // Application settings
    settings?: any,
    // BackgroundGeolocation state
    bgGeo: State
  }


  // You must remove listeners when your component unmounts
  const componentWillUnmount = () =>{
    BackgroundGeolocation.removeListeners();
  }
  const onLocation = (location: Location) =>{
    console.log('[location] -', location);
    BackgroundGeolocation.getGeofences().then(geofences => {
      console.log("[getGeofences] ", geofences);
    })

    // Log event
  }
  const onError = (error: LocationError) =>{
    console.warn('[location] ERROR -', error);
  }
  const onActivityChange = (event: MotionActivityEvent) =>{
    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
  }
  const onProviderChange = (provider: ProviderChangeEvent) =>{
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  const onMotionChange = (event: MotionChangeEvent) =>{
    console.log('[motionchange] -', event.isMoving, event.location);
  }


  //These should publish mqtt events
  const onGeofence = (event: GeofenceEvent) => {
    console.log("[onGeofence] ", event);
    Auth.currentCredentials().then((info) => {

      // Set the correct topic
      PubSub.publish('stream/hello/'+info.identityId, { message: 'Hello from' + JSON.stringify(event), identity: info.identityId, url: "/app/stream/hello"});
    });
    
    
  };

  const onGeofencesChange = (event: GeofencesChangeEvent) => {
    console.log("[onGeofenceChange] ", event);
  };

  const onSchedule = (state: State) => {
    if (state.enabled) {
        console.log("[onSchedule] scheduled start tracking");
      } else {
        console.log("[onSchedule] scheduled stop tracking");
      }
  };


// Here some global listeners could be placed
// ...
export const start = () => {
        ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    // BackgroundGeolocation.onLocation(onLocation, onError); 

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    // BackgroundGeolocation.onMotionChange(onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(onProviderChange);

    BackgroundGeolocation.onGeofence(onGeofence);
    BackgroundGeolocation.onGeofencesChange(onGeofencesChange);
    BackgroundGeolocation.onSchedule(onSchedule);

    ////
    // 2.  Execute #ready method (required)
    //

    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      preventSuspend: true,
      heartbeatInterval: 60,
        schedule: [
            "1 17:30-21:00",    // Sunday: 5:30pm-9:00pm
            "2-6 9:00-00:00",   // Mon-Fri: 9:00am to 5:00pm
            "2,4,6 20:00-00:00",// Mon, Web, Fri: 8pm to midnight (next day)
            "7 10:00-19:00",     // Sat: 10am-7pm
        //    "2018-01-01-09:00 2019-01-01-17:00 geofence"  // <-- track geofences for 1 year
        ],
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        ////
        // 3. Start tracking!
        //
        // BackgroundGeolocation.startGeofences(function() {
        //   console.log("- Start success");
        // });
      }
    //   BackgroundGeolocation.stop();

      BackgroundGeolocation.addGeofence({
        identifier: "App.ts Home",
        radius: 150,
        latitude: 37.33169352,
        longitude:  -122.03069244,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: true,
        loiteringDelay: 30000,  // 30 seconds
        extras: {               // Optional arbitrary meta-data
          zone_id: 1234
        }
      }).then((success) => {
        console.log("[addGeofence] success");
      }).catch((error) => {
        console.log("[addGeofence] FAILURE: ", error);
      });

      BackgroundGeolocation.addGeofence({
        identifier: "App.ts Home (2)",
        radius: 150,
        latitude: 37.33169352,
        longitude:  -122.03069244,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: true,
        loiteringDelay: 30000,  // 30 seconds
        extras: {               // Optional arbitrary meta-data
          zone_id: 1234
        }
      }).then((success) => {
        console.log("[addGeofence] success");
      }).catch((error) => {
        console.log("[addGeofence] FAILURE: ", error);
      });

      // BackgroundGeolocation.addGeofence({
      //   identifier: "City Run",
      //   radius: 150,
      //   latitude:37.33180957,
      //   longitude:  -122.03053391,
      //   notifyOnEntry: true,
      //   notifyOnExit: true,
      //   notifyOnDwell: true,
      //   loiteringDelay: 30000,  // 30 seconds
      //   extras: {               // Optional arbitrary meta-data
      //     zone_id: 1234
      //   }
      // }).then((success) => {
      //   console.log("[addGeofence] success");
      // }).catch((error) => {
      //   console.log("[addGeofence] FAILURE: ", error);
      // });


      BackgroundGeolocation.getGeofences().then(geofences => {
        console.log("[getGeofences] ", geofences);
      })

      BackgroundGeolocation.startSchedule(function() {
        console.log("- Start Schedule success");
      });
    });

    // Listen to #onSchedule events:
    BackgroundGeolocation.onSchedule((state) => {
    let enabled = state.enabled;
    console.log("[onSchedule] - enabled? ", enabled);
    });


    // Later when you want to stop the Scheduler (eg: user logout)
    // BackgroundGeolocation.stopSchedule();

    // You must explicitly stop tracking if currently enabled
    // BackgroundGeolocation.stop();
    
    // Or modify the schedule with usual #setConfig method
    // BackgroundGeolocation.setConfig({
    // schedule: [
    //     "1-7 9:00-10:00",
    //     "1-7 11:00-12:00",
    //     "1-7 13:00-14:00",
    //     "1-7 15:00-16:00",
    //     "1-7 17:00-18:00",
    //     "2,4,6 19:00-22:00"
    // ]
    // });
    Amplify.configure({
        Auth: {
    
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: aws_config.awsCognitoIdentityPoolId,
            
            // REQUIRED - Amazon Cognito Region
            region: aws_config.awsRegion,
    
            // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
            // Required only if it's different from Amazon Cognito Region
            identityPoolRegion: aws_config.awsRegion,
    
            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: aws_config.awsCognitoUserPoolId,//'eu-west-1_UKsPRli8f',
    
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolWebClientId: aws_config.awsCognitoUserPoolAppClientId, // '15h3kqrsp86taf0373eqhq5ruh',
    
            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: false,
            
            // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
            authenticationFlowType: 'USER_PASSWORD_AUTH',
    
            // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
            // clientMetadata: { myCustomKey: 'myCustomValue' },
    
        },
        API: {
            endpoints: [
                {
                    name: "gateway", //aws_config.awsRegion,
                    endpoint: aws_config.awsApiGatewayInvokeUrl,//"https://q1w6usgza7.execute-api.eu-west-1.amazonaws.com/prod",
                    region: "eu-west-1"
                }
            ]
        }
    });


  
    
    

    


    try {
        Auth.currentCredentials().then((info) => {
            // console.log("Identity", info.identityId);
            console.log("accessKeyId", info.accessKeyId);
            console.log("sessionToken", info.sessionToken);
            console.log("secretAccessKey", info.secretAccessKey);
            console.log("identityId", info.identityId);
            console.log("authenticated", info.authenticated);
            
            try{
                    // let topic = "stream/hello/eu-west-1:9a3e21d7-e715-49d6-bb16-e629830752c8"; //'stream/hello/'+info.identityId;
                    // let msg = {message: "boo", identity: "eu-west-1:9a3e21d7-e715-49d6-bb16-e629830752c8", url: "/app/stream/hello"}
                    // PubSub.publish(topic, JSON.stringify(msg));
                    // attachIotPolicy();
                    Amplify.addPluggable(new AWSIoTProvider({
                      aws_pubsub_region: aws_config.awsRegion,
                      aws_pubsub_endpoint: 'wss://'+ aws_config.awsIotHost +'/mqtt',
                      info
          
                    }));


                    // PubSub.publish('stream/hello/'+info.identityId, { message: 'Corona3', identity: info.identityId, url: "stream/hello"});
                    // PubSub.subscribe('stream/hello/' + info.identityId).subscribe({
                    //   next: (data: any) => console.log('Message received', data),
                    //   error: (error: any) => console.error(error),
                    //   close: () => console.log('Done'),
                    // });

            }
            catch (e){
                console.log("error", e);
            }

            if (info.authenticated) {
                startApp()
            } else {
                login()
            }
        });
      } catch (err) {
        console.log('error: ', err)
        login()
      }
      
}

export const startApp = () => {
    Promise.all([
        FontAwesome5.getImageSource('reddit', 25),
        FontAwesome5.getImageSource('react', 25),
    ]).then(([redditIcon, reactIcon]) => {
        Navigation.setRoot({
            root: {
                bottomTabs: {
                    options: {
                        bottomTabs: {
                            titleDisplayMode: 'alwaysShow',
                        },
                    },
                    children: [{
                      stack: {
                          children: [{
                              component: {
                                  name: HOME2,
                                  options: {
                                      topBar: {
                                          visible: true,
                                          title: {
                                              text: 'Home2',
                                          },
                                      },
                                  },
                              },
                          }],
                          options: {
                              bottomTab: {
                                  text: 'Home2',
                                  icon: reactIcon,
                              },
                          },
                      },
                  }],
                },
            },
        });
    });
};


export const login = () =>{
    Promise.all([
        FontAwesome5.getImageSource('reddit', 25),
        FontAwesome5.getImageSource('react', 25),
    ]).then(([redditIcon, reactIcon]) => {
        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                      {
                        component: {
                          name: Login,
                          passProps: {
                            text: 'This is tab 1'
                          },
                          options: {
                                topBar: {
                                    visible: false,
                                },
                            },
                        },
                      },
                    ],
                  },
              }
        });
    });
}

