import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import UserOwnComment from '../../components/UserOwnComment';
import db from '../../db';
import * as Actions from '../../actions';
import AppStyles from '../../styles/AppStyles';

// Settings for the ActionSheet
const WARNING_INDEX = 0;
const CANCEL_INDEX = 1;
const options = ['Delete', 'Cancel'];
const title = 'Are you sure you want to delete this comment?';

const mapStateToProps = state => {
  return {
    user: state.user,
    userComments: state.userComments,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateLoadingStatus: bool => {
      dispatch(Actions.updateLoadingStatus(bool));
    },
    getAllCommentsByUser: user => {
      dispatch(Actions.getAllCommentsByUser(user));
    },
    deleteOneComment: (commentId, userData, photoId) => {
      dispatch(Actions.deleteComment(commentId, userData, photoId));
    },
  };
};

class Comments extends React.Component {
  state = {
    comments: [],
    commentIdSelected: '',
    phototagIdForComment: '',
  };

  _keyExtractor = (item, index) => item.id;

  componentDidMount() {
    this.props.getAllCommentsByUser(this.props.user);
  }

  goToPhototagsDetail = item => {
    this.props.navigation.navigate('PhototagFromMap', item);
  };

  confirmDelete = (commentId, phototagId) => {
    console.log('comment + photo ids', commentId, phototagId);
    this.setState(
      {
        commentIdSelected: commentId,
        phototagIdForComment: phototagId,
      },
      () => {
        this.showActionSheet();
      }
    );
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleActionSheetPress = selectedIndex => {
    if (selectedIndex === WARNING_INDEX) {
      this.props.deleteOneComment(
        this.state.commentIdSelected,
        this.props.user,
        this.state.phototagIdForComment
      );
    }
  };

  render() {
    return (
      <View>
        <Text style={AppStyles.titleText}>My Comments</Text>
        <FlatList
          data={this.props.userComments}
          renderItem={({ item }) => (
            <UserOwnComment
              userId={this.props.user.id}
              comment={item}
              deleteComment={this.confirmDelete}
              goToPhototags={this.goToPhototagsDetail.bind(this, item.phototagData)}
            />
          )}
          keyExtractor={this._keyExtractor}
        />
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

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
