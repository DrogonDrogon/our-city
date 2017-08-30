import React from 'react';

import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import PhototagItem from '../components/PhototagItem';
export default class UserScreen extends React.Component {
  state = { description: '' };
  render() {
    console.log('told you so', this.props.navigation.state);
    return (
      <ScrollView>
        <Text style={styles.titleText} />
        <PhototagItem phototag={this.props.navigation.state.params} />

        <Text style={styles.titleText} />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Edit description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
        />
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
