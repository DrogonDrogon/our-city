import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default class Comment extends React.Component {
  deleteComment = () => {
    console.log('delete comment');
  };

  render() {
    let isMyOwnComment = false;
    if (this.props.comment.userId === this.props.userId) {
      isMyOwnComment = true;
    }
    return (
      <View style={styles.commentContainer}>
        <Image source={{ uri: this.props.comment.userImage }} style={styles.imageSetting} />
        <View style={styles.textOnlyContainer}>
          <Text style={styles.nameText}>{this.props.comment.userName}</Text>
          <Text style={styles.dateText}>{moment(this.props.comment.timestamp).fromNow()}</Text>
          <Text style={styles.commentText}>{this.props.comment.text}</Text>
        </View>
        {isMyOwnComment && (
          <TouchableHighlight onPress={this.deleteComment} style={styles.touchableDelete}>
            <Ionicons name="md-close" size={20} color="gray" style={{ backgroundColor: '#fff' }} />
          </TouchableHighlight>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
    padding: 10,
    justifyContent: 'center',
  },
  textOnlyContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 16,
    marginRight: 10,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 12,
    marginRight: 10,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  imageSetting: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  touchableDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
