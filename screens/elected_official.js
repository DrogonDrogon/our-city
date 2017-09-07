import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Share,
  Picker,
} from 'react-native';
export default class electedOfficails extends React.Component {
  state = {
    electedOfficailIndex: this.props.navigation.state.params.electedOfficailIndex,
    officials: this.props.navigation.state.params.reps.officials,
  };
  render() {
    console.log('electedOfficails', this.props.navigation.state.params.electedOfficailIndex);
    return (
      <View>
        <Image
          style={{ width: '100%', height: 100, resizeMode: Image.resizeMode.contain }}
          source={{
            uri: this.state.officials[this.state.electedOfficailIndex].photoUrl,
          }}
        />
      </View>
    );
  }
}
