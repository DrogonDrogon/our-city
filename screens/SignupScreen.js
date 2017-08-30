import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import * as Actions from '../redux/actions';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import LoginStyles from '../styles/LoginStyles.js';

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
    name: '',
    email: '',
    password: '',
  };

  componentDidMount() {
    this.props.checkIfLoggedIn();
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      console.log('[Signup] --> navigate to main');
      this._navigateTo('Main');
    }
  }

  pressSignupWithEmail() {
    console.log('Sign up with email');

    // TODO: Add error checking or logic for valid email & matching password

    let email = this.state.email;
    let password = this.state.password;

    // if valid: continue to create user with firebase auth
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      console.log('Error with create user', error.code, error.message);
    });

    // if not valid, show message whether email is wrong or password does not match
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
            <Label text="Name" />
            <TextInput
              style={LoginStyles.textInput}
              placeholder="Name"
              onChangeText={text => this.setState({ name: text })}
            />
          </Container>
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
            <TextInput style={LoginStyles.textInput} placeholder="Password" secureTextEntry />
          </Container>
          <Container>
            <TextInput
              style={LoginStyles.textInput}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={text => this.setState({ password: text })}
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
