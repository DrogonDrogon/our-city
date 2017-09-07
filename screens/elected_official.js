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
  render() {
    console.log('electedOfficails', this.props.navigation.state.params.electedOfficailIndex);
    return (
      <View>
        <Image
          style={{ width: '100%', height: 100, resizeMode: Image.resizeMode.contain }}
          source={{
            uri: this.props.navigation.state.params.reps.officials[
              this.props.navigation.state.params.electedOfficailIndex
            ].photoUrl,
          }}
        />
      </View>
    );
  }
}
