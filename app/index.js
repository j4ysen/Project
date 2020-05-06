import { Navigation } from 'react-native-navigation';
import { startApp, login ,start} from './src/App';
// import './shim'

Navigation.events().registerAppLaunchedListener(() => {
    // startApp();
    start();
});