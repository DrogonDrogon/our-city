import React from 'React';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import AppStyles from '../styles/AppStyles';

export default class UserOwnComment extends React.Component {
  render() {
    return (
      <View style={styles.commentContainer}>
        <TouchableHighlight onPress={this.props.goToPhototags} style={styles.touchable}>
          <View style={styles.textOnlyContainer}>
            <Text style={styles.commentText}>{this.props.comment.text}</Text>
            {this.props.comment.phototagData && (
              <Text style={styles.postTitle}>
                in '{this.props.comment.phototagData.description}'
              </Text>
            )}
            <Text style={styles.dateText}>{moment(this.props.comment.timestamp).fromNow()}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.deleteComment(this.props.comment.id, this.props.comment.phototagId)}
          style={styles.touchableDelete}>
          <Ionicons name="md-close" size={20} color="gray" style={{ backgroundColor: '#fff' }} />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  touchable: {
    backgroundColor: '#fff',
    width: '100%',
  },
  textOnlyContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  dateText: {
    fontSize: 12,
    marginRight: 10,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
  postTitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  touchableDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
