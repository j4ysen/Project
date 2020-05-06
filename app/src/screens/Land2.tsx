import React, { useCallback } from 'react';
import {
    SafeAreaView,
    Text,
    FlatList,
    Linking,
    View,
    Button
} from 'react-native';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { Agenda } from 'react-native-calendars';

import { refresh } from '../store/timetables/actions';

import Item from '../components/listItem';
import { Navigation } from 'react-native-navigation';
import { LAND2 } from '../screens';

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


const Land2: Land2ComponentType = ({
    componentId,
}): JSX.Element => {
    // Redux Hooks
    // ===========
    // selectors
    const timetables = useSelector((s: GlobalState) => s.timetables);
    console.log("TIMETABLES: ", timetables);


    const {
        isFetching,
        items: timetableItems,
        error,
        selected,
    } = timetables || {
        isFetching: true,
        items: [],
        error: null,
        selected: null,
    }

    // actions
    const dispatch = useDispatch();
    const onRefresh = useCallback(
        () => dispatch(refresh("test")),
        [dispatch],
    );
    // ===========

    // equivalent to componentDidMount
    React.useEffect(() => {
        // fetchPosts(selectedSubreddit);
    }, [componentId]);

    useNavigationComponentDidAppear((e) => {
        console.log(`${e.componentName} appeared`);
    }, componentId);

    const onItemPressed = () => {
        console.log("pressed");
        // onRefresh();
        // BackgroundGeolocation.getGeofences().then(geofences => {
            // console.log("FENCES", geofences);
            // console.log("FENCES", geofences.map(a => a.identifier));
        //   })
        
    };
    const status  = () => {
        return getStatus("test")
    }
    const getStatus = async (text: string) => {
        let fences = await BackgroundGeolocation.getGeofences()

        if (!fences.find(obj => (obj.identifier == selected))){
            console.log("MATCH");
            return await text;
        }
        else {
            console.log("no MATCH");
            return await text;
        }
            
        return text;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            { error && <Text>Error {error.toString()}</Text> }
            <Text>
                {

                    JSON.stringify(timetableItems.find(obj => obj.title == selected))
                    // getStatus("hey")
                    // status()
                }
            </Text>

            <Button
                        // buttonStyle={styles.loginButton}
                        // onPress={() => this.onLoginPress()}
                        title="Login"
                        onPress={onItemPressed}
                 />
        </SafeAreaView>
    );
};

Land2.options = (passProps: any) => ({
    topBar: {
        visible: true,
        title: {
            text: `${passProps.title}`,
        },
    },
});

export default Land2;
