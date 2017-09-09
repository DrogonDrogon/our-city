import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import UserOwnComment from '../../components/UserOwnComment';
import db from '../../db';
import * as Actions from '../../actions';

// Settings for the ActionSheet
const WARNING_INDEX = 0;
const CANCEL_INDEX = 1;
const options = ['Delete', 'Cancel'];
const title = 'Are you sure you want to delete this comment?';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateLoadingStatus: bool => {
      dispatch(Actions.updateLoadingStatus(bool));
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
    this.getCommentsForUser();
  }

  goToPhototagsDetail = item => {
    this.props.navigation.navigate('PhototagFromMap', item);
  };

  getCommentsForUser = () => {
    this.props.updateLoadingStatus(true);
    let commentKeys = Object.keys(this.props.user.comments);
    // Use comment Id to query comments,
    const commentPromises = commentKeys.map(id => {
      return db
        .child('comments/' + id)
        .once('value')
        .then(snapshot => {
          return snapshot.val();
        })
        .catch(err => {
          console.log('Err fetching comments', err);
        });
    });
    Promise.all(commentPromises)
      .then(comments => {
        return comments;
      })
      // Then get the phototagData from comment.phototagId
      .then(comments => {
        let validComments = comments.filter(item => {
          return item !== null && item !== undefined;
        });

        const photoPromises = validComments.map(comment => {
          return db
            .child('phototags/' + comment.phototagId)
            .once('value')
            .then(snapshot => {
              comment.phototagData = snapshot.val();
              return snapshot.val();
            });
        });
        Promise.all(photoPromises).then(phototagData => {
          this.setState({ comments: validComments });
          this.props.updateLoadingStatus(false);
        });
      })
      .catch(err => {
        console.log('Err getting phototags', err);
        this.props.updateLoadingStatus(false);
      });
  };

  deleteComment = (commentId, phototagId) => {
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
      // Run the delete function
      db.deleteComment(
        this.state.commentIdSelected,
        this.props.user.id,
        this.state.phototagIdForComment,
        (err, data) => {
          if (err) {
            console.log('Err deleting', err);
            //TODO: handle error
          } else {
            console.log('Success deleting', data);
            this.getCommentsForUser();
          }
        }
      );
    }
  };

  render() {
    return (
      <View>
        <Text style={styles.titleText}>My Comments</Text>
        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => (
            <UserOwnComment
              userId={this.props.user.id}
              comment={item}
              deleteComment={this.deleteComment}
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
