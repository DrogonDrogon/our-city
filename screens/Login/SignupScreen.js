import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import * as Actions from '../../actions';
import Container from '../../components/Container';
import Button from '../../components/Button';
import Label from '../../components/Label';
import LoginStyles from '../../styles/LoginStyles.js';
import AppStyles from '../../styles/AppStyles';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    checkIfLoggedIn: () => {
      dispatch(Actions.checkUserLogin());
    },
  };
};

class SignupScreen extends Component {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
  };

  componentDidMount() {
    this.props.checkIfLoggedIn(this.state.signupName);
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      console.log('[Signup] --> navigate to main');
      this._navigateTo('Main');
    }
  }

  pressSignupWithEmail() {
    console.log('Click Create Account with Email');
    // Only allow saving if not blank
    if (
      this.state.email !== '' &&
      this.state.password !== '' &&
      this.state.passwordConfirm !== ''
    ) {
      let email = this.state.email;
      let password = this.state.password;
      // if valid: continue to create user with firebase auth
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        console.log('Error with create user', error.code, error.message);
        Alert.alert('Error', error.message, [{ text: 'OK', onPress: () => {} }]);
      });

      // TODO: If not valid because invalid email/password logic
    } else if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert('Error', 'Passwords do not match', [{ text: 'OK', onPress: () => {} }]);
    } else {
      // If not valid because fields blank, show alert message to user
      Alert.alert('Error', 'Email and password are required', [{ text: 'OK', onPress: () => {} }]);
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
      <ScrollView style={LoginStyles.scroll}>
        <Container>
          <Container>
            <Label text="Email" />
            <TextInput
              style={LoginStyles.textInput}
              placeholder="Email"
              onChangeText={text => this.setState({ email: text })}
            />
          </Container>
          <Container>
            <Label text="Password" />
            <TextInput
              style={LoginStyles.textInput}
              placeholder="Password"
              secureTextEntry
              onChangeText={text => this.setState({ password: text })}
            />
          </Container>
          <Container>
            <TextInput
              style={LoginStyles.textInput}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={text => this.setState({ passwordConfirm: text })}
            />
          </Container>
        </Container>
        <Container>
          <Button
            label="Create Account"
            styles={{ button: LoginStyles.primaryButton, label: LoginStyles.buttonWhiteText }}
            onPress={this.pressSignupWithEmail.bind(this)}
          />
        </Container>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
