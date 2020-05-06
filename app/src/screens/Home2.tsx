import React, { useCallback } from 'react';
import {
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Dimensions,
    Platform,
    Alert,
    Text,
    View,
    TextInput,
    Button,
    StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { refresh, select } from '../store/timetables/actions';

import { LAND2 } from '../screens';
import Item from '../components/listItem';
import Amplify, { Auth, API, PubSub } from 'aws-amplify';


const Home2: Home2ComponentType = ({
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
    } = timetables || {
        isFetching: true,
        items: [],
        error: null,
    }
    // actions
    const dispatch = useDispatch();
    const onRefresh = useCallback(
        (sr: string) => dispatch(refresh(sr)),
        [dispatch],
    );
    const onSelect = useCallback(
        (sr: string) => dispatch(select(sr)),
        [dispatch],
    );
    // ===========

    const listRef = React.useRef<FlatList<TimetablesInfo>>(null);
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = React.useState(0);

    React.useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();
        onRefresh("hello");

    }, [componentId]);

    useNavigationButtonPress((_) => {
        Alert.alert('Logging out');
        Auth.signOut().then((info) => {
            console.log("logging out: ", info);
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
        })
    }, componentId, 'hi_button_id');

    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    const freshen = (subreddit: string) => {
        onRefresh("hello");
    };

    const onItemPressed = (subreddit: string) => {
        onSelect(subreddit)
        Navigation.push(componentId, {
            component: {
                name: LAND2,
                passProps: {
                    title: subreddit,
                    // Pass in value
                },
            },
        });
    };

    const onItemLongPressed = (subreddit: string) => {

    };

    const onAddSubredditPressed = (subreddit: string) => {
        // onRefresh(subreddit);
    };

    const listScrollToBottom = () =>
        listRef.current && listRef.current.scrollToEnd({animated: true});

    return (
        <SafeAreaView style={{flex: 1}}>
            {false &&
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                    <Text style={styles.logoText}>Sign in</Text>
                    <TextInput placeholder="Username"  style={styles.loginFormTextInput} />
                    <TextInput placeholder="Password"  style={styles.loginFormTextInput} secureTextEntry={true}/>
                    <Button
                        // buttonStyle={styles.loginButton}
                        // onPress={() => this.onLoginPress()}
                        title="Login"
                        onPress={() => Alert.alert('Simple Button pressed')}
                    />
                    </View>
                </View>}
            
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <Button
                        // buttonStyle={styles.loginButton}
                        // onPress={() => this.onLoginPress()}
                        title="Login"
                        onPress={freshen}
                 />
                <FlatList
                    ref={listRef}
                    onContentSizeChange={listScrollToBottom}
                    onLayout={listScrollToBottom}
                    data={timetableItems}
                    keyExtractor={(item) => item.title }
                    refreshing={isFetching}
                    renderItem={({ item }) =>
                        <Item
                            data={item.title}
                            title={item.identifier}
                            textSize={22}
                            onPressed={onItemPressed}
                            onLongPressed={onItemLongPressed}
                        />
                    }
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    
};

Home2.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Subreddits',
        },
        rightButtons: [{
            id: 'hi_button_id',
            text: 'Logout',
        }],
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 26,
        margin: 16,
        textAlign: 'center',
    },
    containerView: {
        flex: 1,
      },
      loginScreenContainer: {
        flex: 1,
      },
      logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 150,
        marginBottom: 30,
        textAlign: 'center',
      },
      loginFormView: {
        flex: 1
      },
      loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
      
      },
      loginButton: {
        backgroundColor: '#3897f1',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
      },
      fbLoginButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
      },
});

export default Home2;


