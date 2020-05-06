import { call, put, takeEvery } from 'redux-saga/effects';
import { REFRESH, receiveTimetables, failReceiveTimetables, RECEIVE_TIMETABLES } from './actions';

import Amplify, { Auth, API, PubSub } from 'aws-amplify';

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


interface Timetable {
  [x: string]: any;
  
  [index: number]:{
    title: string,
    latitude: number,
    longitude: number,
    start: string,
    end: string,
    json: string, // details?
    identifier: string,
    radius: number,
  }

}

function updateGeoFences(elements: Timetable){

  BackgroundGeolocation.getGeofences().then(geofences => {
    elements.map((value: { latitude: number; longitude: number; identifier: any; radius: any; }, index: any) => {
      if (!geofences.find(obj => (obj.latitude == value.latitude && obj.longitude == value.longitude))){
        BackgroundGeolocation.addGeofence({
          identifier: value.identifier,
          radius: value.radius,
          latitude: value.latitude,
          longitude:  value.longitude,
          notifyOnEntry: true,
          notifyOnExit: true,
          notifyOnDwell: true,
          loiteringDelay: 30000,  // 30 seconds
          extras: {               // Optional arbitrary meta-data
            zone_id: 1234
          }
        }).then((success) => {
          console.log("[addGeofence] success", value.identifier);
        }).catch((error) => {
          console.log("[addGeofence] FAILURE: ", error);
        });
      }
    })

    geofences.map((value, index) => {
      if (!elements.find((obj: { latitude: number; longitude: number; }) => (obj.latitude == value.latitude && obj.longitude == value.longitude))){
        BackgroundGeolocation.removeGeofence(value.identifier).then((success) => {
          console.log("[removeGeofence] success", value.identifier);
        }).catch((error) => {
          console.log("[removeGeofence] FAILURE: ", error);
        });
      }
    })

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

  })
}

async function getTimetable(stream: string){
  let apiName = 'gateway';
  let get_path = `/getTimetable/${encodeURIComponent(stream)}`;
  let myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
  }
  return await API.get(apiName, get_path, myInit);  
}


function* fetchTimetables({ word }: RefreshAction) {
    try {
        const timetables = yield call(getTimetable, "stream/test");
        // console.log("Updating timetable to ", timetables.data.timetables)
        updateGeoFences(timetables.data.timetables)
        yield put(receiveTimetables(timetables.data.timetables));
    } catch (e) {
        yield put(failReceiveTimetables(e));
    }
    console.log("Refresh called:", word)
}

export default function* refreshTimetable() {

    yield takeEvery<RefreshAction>(REFRESH, fetchTimetables);
}



// Get status


// async function setTimetable(username: string){
//   let path = `/setTimetable/${encodeURIComponent("stream/test")}`; 
//   let user_gateway = 'gateway';
//   let user_init = { // OPTIONAL
//       headers: {}, // OPTIONAL
//       response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
//       body: {
//            "username": "username"
//       }
//       // queryStringParameters: {
//       //     "alpha"
//       // }
//   }
//   API.post(user_gateway, path, user_init).then(response => {
//       // Add your code here
//       console.log("POST timetable:" ,response.data)
//       return response.data;
//   }).catch(error => {
//       console.log(error.response)
//   });
// }



// Todo:
// - Qualify items on the backend