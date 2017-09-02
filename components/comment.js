import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment';

export default class Comment extends React.Component {
  state = {
    timeStamp: moment(this.props.comment.timeStamp).fromNow(),
  };
  render() {
    return (
      <View style={styles.commentContainer}>
        <Text style={styles.titleText}>{this.props.userName}</Text>
        <Text style={styles.titleText}>{this.props.comment.text}</Text>
        <Text style={styles.titleText}>{this.state.timeStamp}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});
