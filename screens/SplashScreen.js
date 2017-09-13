import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Permissions, Notifications } from 'expo';
import * as Actions from '../actions';
import AppStyles from '../styles/AppStyles';

const mapStateToProps = state => {
  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkIfLoggedIn: () => {
      dispatch(Actions.checkUserLogin());
    },
    updateUser: userData => {
      dispatch(Actions.updateUser(userData));
    },
  };
};

class SplashScreen extends React.Component {
  componentDidMount() {
    this.props.checkIfLoggedIn();
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      this.notifications();
      console.log('[SplashScreen] --> navigate to main');
      this._navigateTo('Main');
    } else {
      console.log('[SplashScreen] --> navigate to auth');
      this._navigateTo('Login');
    }
  }
  async notifications() {
    console.log('notifications splash');

    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);

    this.props.user.token = token;
    console.log('token', this.props.user);
    this.props.updateUser(this.props.user);
  }

  _navigateTo(routeName) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    this.props.navigation.dispatch(actionToDispatch);
  }

  render() {
    return (
      <View style={AppStyles.splash}>
        <Image
          style={{ height: '100%', width: '100%' }}
          source={require('../assets/images/mesh-1430108_1280.png')}
          resizeMode="cover"
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
