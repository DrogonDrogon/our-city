import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment';

export default class Comment extends React.Component {
  state = {
    timeStamp: moment(this.props.comment.timeStamp).fromNow(),
  };
  render() {
    return (
      <View>
        <Text style={styles.titleText}>{this.props.userName}</Text>
        <Text style={styles.titleText}>{this.props.comment.text}</Text>
        <Text style={styles.titleText}>{this.state.timeStamp}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});
