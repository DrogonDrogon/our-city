import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment';

export default class Comment extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.titleText}>{this.props.userName}</Text>
        <Text style={styles.titleText}>{this.props.comment.text}</Text>
        <Text style={styles.titleText}>{moment(this.props.comment.timeStamp).fromNow()}</Text>
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
