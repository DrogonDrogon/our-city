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
        <Image style={{height: '100%', width: '100%'}} source={require('../assets/images/mesh-1430108_1280.png')} resizeMode="cover" />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
