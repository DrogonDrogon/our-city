import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import Expo from 'expo';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import config from '../config/config';
import RootNavigation from '../components/RootNavigation';

const navigateAction = NavigationActions.navigate({
  routeName: 'Main',
  params: {},
  action: NavigationActions.navigate({ routeName: 'Main' })
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    console.log('PROPS ARE', props);
  }

  componentWillMount() {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log('We are authenticated now!');
        this.props.navigation.dispatch(navigateAction);
      }
      // Do other things
    });
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

  pressFacebook() {
    
    console.log('facebook pressed');  
    this.props.loginWithFacebook();
  }

  pressFacebook() {
    this.props.loginWithFacebook();//execute any code here
  }

  pressFacebook() {
    // this.props.loginWithFacebook();
    console.log('facebook pressed');
  }

  pressFacebook() {
    // this.props.loginWithFacebook();
    console.log('facebook pressed');
  }

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <Container>
          <Button
            label="Forgot Login/Pass"
            styles={{ button: styles.alignRight, label: styles.label }}
            onPress={this.press.bind(this)}
          />
        </Container>
        <Container>
          <Label text="Username or Email" />
          <TextInput style={styles.textInput} />
        </Container>
        <Container>
          <Label text="Password" />
          <TextInput secureTextEntry style={styles.textInput} />
        </Container>
        <Container>
          <Button styles={{ button: styles.transparentButton }} onPress={this.press.bind(this)}>
            <View style={styles.inline}>
              <Icon name="facebook-official" size={30} color="#3B5699" />
              <Text style={[styles.buttonBlueText, styles.buttonBigText]}> Connect </Text>
              <Text style={styles.buttonBlueText}>with Facebook</Text>
            </View>
          </Button>
        </Container>
        <View style={styles.footer}>
          <Container>
            <Button
              label="Sign In"
              styles={{ button: styles.primaryButton, label: styles.buttonWhiteText }}
              onPress={this.press.bind(this)}
            />
          </Container>
          <Container>
            <Button
              label="CANCEL"
              styles={{ label: styles.buttonBlackText }}
              onPress={this.press.bind(this)}
            />
          </Container>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column',
  },
  label: {
    color: '#0d8898',
    fontSize: 20,
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  textInput: {
    height: 80,
    fontSize: 30,
    backgroundColor: '#FFF',
  },
  transparentButton: {
    marginTop: 30,
    borderColor: '#3B5699',
    borderWidth: 2,
  },
  buttonBlueText: {
    fontSize: 20,
    color: '#3B5699',
  },
  buttonBigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inline: {
    flexDirection: 'row',
  },
  buttonWhiteText: {
    fontSize: 20,
    color: '#FFF',
  },
  buttonBlackText: {
    fontSize: 20,
    color: '#595856',
  },
  primaryButton: {
    backgroundColor: '#34A853',
  },
  footer: {
    marginTop: 100,
  },
});
