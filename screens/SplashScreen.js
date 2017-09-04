import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import * as Actions from '../actions';
import AppStyles from '../styles/AppStyles';

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkIfLoggedIn: () => {
      dispatch(Actions.checkUserLogin());
    },
  };
};

class SplashScreen extends React.Component {
  componentDidMount() {
    this.props.checkIfLoggedIn();
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      console.log('[SplashScreen] --> navigate to main');
      this._navigateTo('Main');
    } else {
      console.log('[SplashScreen] --> navigate to auth');
      this._navigateTo('Login');
    }
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
        <Image source={require('../assets/images/pexels-photo-408951crop2.png')} resizeMode="contain" />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
