import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import Container from '../components/Container';
import Button from '../components/Button';
import LoginStyles from '../styles/LoginStyles.js';

class SignupScreen extends Component {
  pressSignupWithEmail() {
    console.log('sign up with email');
  }

  render() {
    return (
      <ScrollView style={LoginStyles.scroll}>
        <Container>
          <Text>Name</Text>
          <TextInput placeholder="Name" />
          <Text>Email</Text>
          <TextInput placeholder="Email" />
          <Text>Password</Text>
          <TextInput placeholder="Password" secureTextEntry />
          <TextInput placeholder="Confirm Password" secureTextEntry />
        </Container>
        <Container>
          <Button
            label="Sign In"
            styles={{ button: LoginStyles.primaryButton, label: LoginStyles.buttonWhiteText }}
            onPress={this.pressSignupWithEmail.bind(this)}
          />
        </Container>
      </ScrollView>
    );
  }
}

export default SignupScreen;
