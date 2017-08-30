import React from 'react';

import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import PhototagItem from '../components/PhototagItem';
export default class MapScreen extends React.Component {
  state = {
    comment: '',
    votes: 0,
  };

  upvote() {
    this.setState({ votes: this.state.votes + 1 });
  }

  unvote() {
    this.setState({ votes: this.state.votes - 1 }, () => {
      if (this.state.votes < 0) {
        this.setState({ votes: 0 });
      }
    });
  }

  render() {
    return (
      <ScrollView>
        <PhototagItem phototag={this.props.navigation.state.params} />
        <Text style={styles.titleText}>{this.state.votes}</Text>
        <Button title="upvote" onPress={this.upvote.bind(this)} />
        <Button title="unvote" onPress={this.unvote.bind(this)} />
        <TextInput
          placeholder="Enter comment"
          onChange={text => this.setState({ comment: text })}
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
