import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Expo from 'expo';
import firebase from 'firebase';
import * as Actions from '../redux/actions';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import config from '../config/config';
import AppStyles from '../styles/AppStyles.js';
import LoginStyles from '../styles/LoginStyles.js';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveNewUser: userInfo => {
      dispatch(Actions.postNewUserBegin(userInfo));
    },
    checkIfLoggedIn: () => {
      dispatch(Actions.checkUserLogin());
    },
  };
};

class Login extends Component {
  componentWillMount() {
    // Check if user is authenticated
    this.props.checkIfLoggedIn();
  }

  componentWillUpdate(nextProps, nextState) {
    // If logged in, Navigate to main view
    if (nextProps.isLoggedIn === true) {
      this._navigateTo('Main');
    }
  }

  press() {
    this.loginWithFacebook();
  }

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      config.facebook.API_KEY,
      { permissions: ['public_profile'] }
    );
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch(error => {
        // Handle Errors here.
        console.log('Error with fb login', error);
      });
      console.log('Credential from fb', credential);
    }
  }

  _navigateTo(routeName) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName }, )],
    });
    this.props.navigation.dispatch(actionToDispatch);
  }

  render() {
    return (
      <ScrollView style={LoginStyles.scroll}>
        <Container>
          <Button
            label="Forgot Login/Pass"
            styles={{ button: LoginStyles.alignRight, label: LoginStyles.label }}
            onPress={this.press.bind(this)}
          />
        </Container>
        <Container>
          <Label text="Username or Email" />
          <TextInput style={LoginStyles.textInput} />
        </Container>
        <Container>
          <Label text="Password" />
          <TextInput secureTextEntry style={LoginStyles.textInput} />
        </Container>
        <Container>
          <Button styles={{ button: LoginStyles.transparentButton }} onPress={this.press.bind(this)}>
            <View style={LoginStyles.inline}>
              <Icon name="facebook-official" size={30} color="#3B5699" />
              <Text style={[LoginStyles.buttonBlueText, LoginStyles.buttonBigText]}> Connect </Text>
              <Text style={LoginStyles.buttonBlueText}>with Facebook</Text>
            </View>
          </Button>
        </Container>
        <View style={LoginStyles.footer}>
          <Container>
            <Button
              label="Sign In"
              styles={{ button: LoginStyles.primaryButton, label: LoginStyles.buttonWhiteText }}
              onPress={this.press.bind(this)}
            />
          </Container>
          <Container>
            <Button
              label="CANCEL"
              styles={{ label: LoginStyles.buttonBlackText }}
              onPress={this.press.bind(this)}
            />
          </Container>
        </View>
      </ScrollView>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
