import React, { useCallback } from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    Keyboard, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Button
} from 'react-native';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';
import { login, register } from '../store/auth/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';
import { Agenda } from 'react-native-calendars';


const Login: LoginComponentType = ({ componentId }): JSX.Element => {
    // Redux Hooks
    // ===========
    // selectors
    const auth = useSelector((s: GlobalState) => s.auth);
    console.log
    // const {
    //     isFetching,
    //     items: posts,
    //     error,
    // } = auth || {
    //     isFetching: true,
    //     items: [],
    //     error: null,
    // }

    // actions
    const dispatch = useDispatch();
    const requestLogin = useCallback(
        (username: string, email: string, password: string) => dispatch(login(username, email, password)),
        [dispatch],
    );
    const requestRegister = useCallback(
        (username: string, email: string, password: string) => dispatch(register(username, email, password)),
        [dispatch],
    );
    // ===========

    // equivalent to componentDidMount
    React.useEffect(() => {
        // requestAuth(username, email, password);
    }, [componentId]);

    useNavigationComponentDidAppear((e) => {
        console.log(`${e.componentName} appeared`);
    }, componentId);

    const [username_value, username] = React.useState('');
    const [email_value, email] = React.useState('');
    const [password_value, password] = React.useState('');

    const loginPress = () => {
        console.log("Login.tsx: Requesting Login", username_value.trim(), email_value.trim(), password_value.trim())
        requestLogin(username_value.trim(), email_value.trim(), password_value.trim());
    };

    const RegisterPress = () => {
        console.log("Login.tsx: Requesting Register", username_value.trim(), email_value.trim(), password_value.trim())
        requestRegister(username_value.trim(), email_value.trim(), password_value.trim());
    };

    return (
     

        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.loginScreenContainer}>
                    <View style={styles.loginFormView}>
                    <Text style={styles.logoText}>Sign in </Text>
                    <TextInput
                        placeholder="Username"
                        style={styles.loginFormTextInput} 
                        onChangeText={(text) => username(text)}
                        autoCapitalize="none"
                        />
                    <TextInput
                        placeholder="Email"  
                        style={styles.loginFormTextInput} 
                        onChangeText={(text) => email(text)}
                        autoCapitalize="none"
                        />
                    {/* <TextInput
                        placeholder="Stream"  
                        style={styles.loginFormTextInput} 
                        onChangeText={(text) => email(text)}
                        autoCapitalize="none"
                        /> */}
                    <TextInput 
                        placeholder="Password"
                        style={styles.loginFormTextInput}
                        secureTextEntry={true}
                        onChangeText={(text) => password(text)}
                        autoCapitalize="none"/>
                    <Button
                        // buttonStyle={styles.loginButton}
                        // onPress={() => this.onLoginPress()}
                        title="Login"
                        onPress={() => 
                            // Alert.alert('Simple Button pressed')
                            loginPress()
                        }
                    />
                    <Button
                        // buttonStyle={styles.loginButton}
                        // onPress={() => this.onLoginPress()}
                        title="Register"
                        onPress={() => 
                            // Alert.alert('Simple Button pressed')
                            RegisterPress()
                        }
                    />
                    </View>
                </View>
                </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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

export default Login;
