import React from 'react';

import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PhototagItem from '../components/PhototagItem';
export default class MapScreen extends React.Component {
  render() {
    console.log('told you so', this.props.navigation.state);
    return (
      <ScrollView>
        <PhototagItem phototag={this.props.navigation.state.params} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});
