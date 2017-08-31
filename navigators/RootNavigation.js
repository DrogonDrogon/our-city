import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import selectedPhototagMap from '../screens/MapPhotoTagScreen';
import selectedPhototagUser from '../screens/User/UserPhotoTagScreen';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens//Login/SignupScreen';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

// RootNavigation actually uses a StackNavigator but the StackNavigator in turn loads a TabNavigator
const RootStackNavigator = StackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
    phototagFromMap: {
      screen: selectedPhototagMap,
    },
    phototagFromUser: {
      screen: selectedPhototagUser,
    },
    Signup: {
      screen: SignupScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default class RootNavigator extends React.Component {
  static navigationOptions = {
    title: 'SplashScreen',
  };

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
  };
}
