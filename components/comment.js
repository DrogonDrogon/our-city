import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import db from '../db';
import AppStyles from '../styles/AppStyles';

// Settings for the ActionSheet
const WARNING_INDEX = 0;
const CANCEL_INDEX = 1;
const options = ['Delete', 'Cancel'];
const title = 'Are you sure you want to delete this comment?';

export default class Comment extends React.Component {
  confirmDeleteComment = () => {
    this.showActionSheet();
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetPress = selectedIndex => {
    if (selectedIndex === WARNING_INDEX) {
      // Run the delete function
      this.props.notifyDeletedComment(
        this.props.comment.id,
        this.props.userId,
        this.props.comment.phototagId
      );
    }
  };

  render() {
    let isMyOwnComment = false;
    if (this.props.comment.userId === this.props.userId) {
      isMyOwnComment = true;
    }
    return (
      <View style={AppStyles.commentView}>
        <Image source={{ uri: this.props.comment.userImage }} style={AppStyles.imageSetting} />
        <View style={AppStyles.columnContainer}>
          <Text style={AppStyles.nameText}>{this.props.comment.userName}</Text>
          <Text style={AppStyles.dateText}>{moment(this.props.comment.timestamp).fromNow()}</Text>
          <Text style={AppStyles.commentText}>{this.props.comment.text}</Text>
        </View>
        {isMyOwnComment && (
          <TouchableHighlight onPress={this.confirmDeleteComment} style={AppStyles.touchableDelete}>
            <Ionicons name="md-close" size={20} color="gray" style={{ backgroundColor: '#fff' }} />
          </TouchableHighlight>
        )}
        <ActionSheet
          ref={sheet => (this.ActionSheet = sheet)}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={WARNING_INDEX}
          onPress={this.handleActionSheetPress}
        />
      </View>
    );
  }
}