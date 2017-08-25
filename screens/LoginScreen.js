import React, { Component } from 'react';
import * as firebase from 'firebase';
import Expo from 'expo';
import config from '../config/config.js';
import RootNavigation from '../components/RootNavigation'; 
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';

import Container from '../components/Container.js';
import MyButton from '../components/Button.js';
import Label from '../components/Label.js';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  press() {
    //execute any code here
  }

  pressFacebook() {
    
    console.log('facebook pressed');  
    this.props.loginWithFacebook();
  }

  render() {
    return (
      <ScrollView style={styles.scroll}>
        <Container>
          <MyButton 
            label="Forgot Login/Pass"
            styles={{button: styles.alignRight, label: styles.label}} 
            onPress={this.press.bind(this)} />
        </Container>
        <Container>
          <Label text="Username or Email" />
          <TextInput
              style={styles.textInput}
          />
        </Container>
        <Container>
          <Label text="Password" />
          <TextInput
              secureTextEntry={true}
              style={styles.textInput}
          />
        </Container>
        <Container>
          <MyButton 
            styles={{button: styles.transparentButton}}
            onPress={this.pressFacebook.bind(this)}
        >
            <View style={styles.inline}>
              <Icon name="facebook-official" size={30} color="#3B5699" />
              <Text style={[styles.buttonBlueText, styles.buttonBigText]}>  Connect </Text> 
              <Text style={styles.buttonBlueText}>with Facebook</Text>
            </View>
          </MyButton>
        </Container> 
        <View style={styles.footer}>
          <Container>
            <MyButton 
              label="Sign In"
              styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
              onPress={this.press.bind(this)} />
          </Container>
          <Container>
            <MyButton 
              label="CANCEL"
              styles={{label: styles.buttonBlackText}} 
              onPress={this.press.bind(this)} />
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
      fontSize: 20
  },
  alignRight: {
      alignSelf: 'flex-end'
  }, 
  textInput: {
    height: 80,
    fontSize: 30,
    backgroundColor: '#FFF'
  }, 
  transparentButton: {
      marginTop: 30,
      borderColor: '#3B5699',
      borderWidth: 2
  },
  buttonBlueText: {
      fontSize: 20,
      color: '#3B5699'
  },
  buttonBigText: {
      fontSize: 20,
      fontWeight: 'bold'
  },
  inline: {
      flexDirection: 'row'
  },
  buttonWhiteText: {
      fontSize: 20,
      color: '#FFF',
  },
  buttonBlackText: {
      fontSize: 20,
      color: '#595856'
  },
  primaryButton: {
      backgroundColor: '#34A853'
  },
  footer: {
     marginTop: 100
  }     
});