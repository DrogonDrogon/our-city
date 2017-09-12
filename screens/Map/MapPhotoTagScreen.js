import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  Share,
  Modal,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import Comment from '../../components/comment';
import PhotoTagSolutions from '../../components/photoTagSolutions';
import TaggedText from '../../components/TaggedText';
import * as Actions from '../../actions';
import db from '../../db';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isPosting: state.isPosting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePhototag: phototag => {
      dispatch(Actions.updatePhototag(phototag));
    },
    addFavUnderUserId: (userId, phototagId) => {
      let phototagRecord = {};
      let key = phototagId;
      phototagRecord[key] = true;
      dispatch(Actions.addFavUnderUserId(userId, phototagRecord));
    },
    deleteFavUnderUserId: (userId, phototagId) => {
      dispatch(Actions.deleteFavUnderUserId(userId, phototagId));
    },
    updatePhototagWithComment: (phototagId, commentId) => {
      let newCommentRecord = {};
      let key = commentId;
      newCommentRecord[key] = true;
      dispatch(Actions.addCommentUnderPhototag(phototagId, newCommentRecord));
    },
    updateUser: userData => {
      dispatch(Actions.updateUser(userData));
    },
  };
};

class MapPhotoTagScreen extends React.Component {
  state = {
    comment: '',
    upvotes: this.props.navigation.state.params.upvotes,
    downvotes: this.props.navigation.state.params.downvotes,
    voteTotal:
      this.props.navigation.state.params.upvotes - this.props.navigation.state.params.downvotes,
    phototag: this.props.navigation.state.params,
    comments: [],
    modalVisibility: false,
    modalSolutionsVis: false,
    modalNavTitle: {
      title: 'Edit Description',
    },
    modalNavRightButton: {
      title: 'Save',
      handler: () => {
        this.saveDescription(this.state.editedDescription);
        this.toggleModal(false);
      },
    },
    modalNavLeftButton: {
      title: 'Cancel',
      handler: () => {
        this.toggleModal(false);
      },
    },
    editedDescription: this.props.navigation.state.params.description,
  };

  componentDidMount() {
    let currentPhototag = this.props.navigation.state.params;
    this.getCommentsForCurrentPhototag(currentPhototag);
    this.getAuthorForCurrentPhototag(currentPhototag.userId);
  }

  getCommentsForCurrentPhototag(currentPhototag) {
    // console.log('THIS COMMENTS -->', this.props.navigation.state.params.comments); // this is an object containing commentIds
    // Run the firebase query for comments here.
    let commentKeys = Object.keys(currentPhototag.comments);
    const commentPromises = commentKeys.map(id => {
      return db
        .child('comments')
        .child(id)
        .once('value')
        .then(snapshot => {
          return snapshot.val();
        })
        .catch(err => {
          console.log('Err getting comments promise', err);
        });
    });
    Promise.all(commentPromises)
      .then(comments => {
        let validComments = [];
        comments.forEach(item => {
          if (item) {
            validComments.push(item);
          }
        });
        this.setState({ comments: validComments });
      })
      .catch(err => {
        console.log('Err getting comments', err);
      });
  }

  getAuthorForCurrentPhototag(userId) {
    db
      .child('users/' + userId)
      .once('value')
      .then(snapshot => {
        let authorPhoto = snapshot.val().photoUrl;
        let authorName = snapshot.val().displayName;
        this.setState({
          authorPhoto,
          authorName,
        });
      })
      .catch(err => {
        console.log('Err getting author of current phototag', err);
      });
  }

  handleClickUpvote = () => {
    let userVotes = this.props.user.votes;
    let phototagId = this.state.phototag.id;

    // if the user has not up-voted or down-voted before, or if currently 0
    if (!userVotes.hasOwnProperty(phototagId) || userVotes[phototagId] === 0) {
      this.setState({ upvotes: this.state.upvotes + 1 }, () => {
        // Update user
        let userData = Object.assign({}, this.props.user);
        userData.votes[phototagId] = 1;
        this.props.updateUser(userData);

        // Update phototag
        let phototagData = this.state.phototag;
        phototagData.upvotes = this.state.upvotes;
        this.props.updatePhototag(phototagData);

        this.updateVoteTotal();
      });
    } else if (userVotes[phototagId] === 1) {
      // if the user has up-voted already, undo the upvote.
      this.setState({ upvotes: this.state.upvotes - 1 }, () => {
        // Update user
        let userData = this.props.user;
        userData.votes[phototagId] = 0;
        this.props.updateUser(userData);

        // Update phototag
        let phototagData = this.state.phototag;
        phototagData.upvotes = this.state.upvotes;
        this.props.updatePhototag(phototagData);

        this.updateVoteTotal();
      });
    } else if (userVotes[phototagId] === -1) {
      // if the user has down-voted already, undo the downvote and add a upvote.
      this.setState(
        {
          upvotes: this.state.upvotes + 1,
          downvotes: this.state.downvotes - 1,
        },
        () => {
          // Update user
          let userData = this.props.user;
          userData.votes[phototagId] = 1;
          this.props.updateUser(userData);

          // Update phototag upvotes and downvotes count
          let phototagData = this.state.phototag;
          phototagData.upvotes = this.state.upvotes;
          phototagData.downvotes = this.state.downvotes;
          this.props.updatePhototag(phototagData);

          this.updateVoteTotal();
        }
      );
    }
  };

  handleClickDownvote = () => {
    let userVotes = this.props.user.votes;
    let phototagId = this.state.phototag.id;

    // if the user has not up-voted or down-voted before, or if currently 0
    if (!userVotes.hasOwnProperty(phototagId) || userVotes[phototagId] === 0) {
      this.setState({ downvotes: this.state.downvotes + 1 }, () => {
        // Update user
        let userData = this.props.user;
        userData.votes[phototagId] = -1;
        this.props.updateUser(userData);

        // Update phototag
        let phototagData = this.state.phototag;
        phototagData.downvotes = this.state.downvotes;
        this.props.updatePhototag(phototagData);

        this.updateVoteTotal();
      });
    } else if (userVotes[phototagId] === 1) {
      // if the user has up-voted already, undo the upvote and add a downvote.
      this.setState(
        {
          upvotes: this.state.upvotes - 1,
          downvotes: this.state.downvotes + 1,
        },
        () => {
          // Update user
          let userData = this.props.user;
          userData.votes[phototagId] = -1;
          this.props.updateUser(userData);

          // Update phototag
          let phototagData = this.state.phototag;
          phototagData.upvotes = this.state.upvotes;
          phototagData.downvotes = this.state.downvotes;
          this.props.updatePhototag(phototagData);

          this.updateVoteTotal();
        }
      );
    } else if (userVotes[phototagId] === -1) {
      // if the user has down-voted already, then undo the downvote.
      this.setState(
        {
          downvotes: this.state.downvotes - 1,
        },
        () => {
          // Update user
          let userData = this.props.user;
          userData.votes[phototagId] = 0;
          this.props.updateUser(userData);

          // Update phototag upvotes and downvotes count
          let phototagData = this.state.phototag;
          phototagData.downvotes = this.state.downvotes;
          this.props.updatePhototag(phototagData);

          this.updateVoteTotal();
        }
      );
    }
  };

  updateVoteTotal = () => {
    this.setState({
      voteTotal: this.state.upvotes - this.state.downvotes,
    });
  };

  handleClickFav = () => {
    let updatedPhototag = this.state.phototag;
    // If user does not have this favorite, add
    if (!this.props.user.favs[this.state.phototag.id]) {
      this.props.addFavUnderUserId(this.props.user.id, this.state.phototag.id);
      updatedPhototag.favTotal += 1;
      this.props.updatePhototag(this.state.phototag);
    } else {
      // If user does already have this favorite, remove
      this.props.deleteFavUnderUserId(this.props.user.id, this.state.phototag.id);
      updatedPhototag.favTotal -= 1;
      this.props.updatePhototag(this.state.phototag);
    }
  };

  editComment(text) {
    this.setState({ comment: text });
  }

  handleSubmitComment = () => {
    if (this.state.comment !== '') {
      this.saveNewComment(this.state.phototag.id, this.props.user, this.state.comment);
    }
  };

  saveNewComment = (phototagId, user, commentText) => {
    // 1. Creates a new comment under 'comments' in Firebase
    let commentId = db.child('comments').push().key;
    let commentRecord = {
      id: commentId,
      text: commentText,
      userId: user.id,
      userName: user.displayName,
      userImage: user.photoUrl,
      timestamp: new Date(),
      phototagId,
    };

    let tempComments = this.state.comments;
    tempComments.push(commentRecord);
    this.setState({ comments: tempComments });
    this.setState({ comment: '' });

    db
      .child('comments/' + commentId)
      .update(commentRecord)
      .then(() => {
        console.log('Comment posted!');
      })
      .catch(error => console.log('Error writing to comments', error));

    // 2. Adds the commentId under the user's 'comments' node
    let updatedUser = this.props.user;
    updatedUser.comments[commentId] = true;
    this.props.updateUser(updatedUser);

    // 3. Adds the commentId under the phototag 'comments' node
    this.props.updatePhototagWithComment(phototagId, commentId);
  };

  share = () => {
    Share.share({
      title: this.state.phototag.description,
      message: this.state.phototag.description,
      url: this.state.phototag.imageUrl,
    });
  };

  solve = () => {
    this.props.navigation.navigate('SolverScreen', { phototag: Object.assign({}, this.state.phototag)})
  };

  goToElectedOfficials = () => {
    let phototagData = this.state.phototag;
    this.props.navigation.navigate('electedOfficials', { phototag: phototagData });
  };

  notifyDeletedComment = () => {
    // Once a comment is deleted, this component is notified and refreshes UI by getting the latest comments again
    this.getCommentsForCurrentPhototag(this.props.navigation.state.params);
  };

  openEditDescription = () => {
    console.log('Editing description');
    this.toggleModal(true);
  };

  editDescription = description => {
    this.setState({ editedDescription: description });
  };

  saveDescription = description => {
    let updatedData = this.state.phototag;
    updatedData.description = description;
    this.setState({ phototag: updatedData }, () => {
      this.props.updatePhototag(this.state.phototag);
      this.setState({ editedDescription: description });
    });
  };

  toggleModal = bool => {
    this.setState({ modalVisibility: bool });
  };

  toggleSolutionsModal = () => {
    this.setState({ modalSolutionsVis: !this.state.modalSolutionsVis });
  };

  render() {
    let isEditable = this.props.user.id === this.state.phototag.userId;
    let userVoteStatus = this.props.user.votes[this.state.phototag.id];

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.photoDisplayContainer}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.state.phototag.imageUrl }}
          />
          <TaggedText navigation={this.props.navigation} text={this.state.phototag.description} />
        </View>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisibility}
          onRequestClose={() => {}}>
          <NavigationBar
            title={this.state.modalNavTitle}
            rightButton={this.state.modalNavRightButton}
            leftButton={this.state.modalNavLeftButton}
          />
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.photoDisplayContainer}>
              <Image
                style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
                source={{ uri: this.state.phototag.imageUrl }}
              />
              <TextInput
                value={this.state.editedDescription}
                placeholder="Enter description"
                onChangeText={text => this.editDescription(text)}
                clearButtonMode={'always'}
                style={styles.descriptionInput}
                multiline
              />
            </View>
          </KeyboardAwareScrollView>
        </Modal>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TouchableHighlight onPress={this.handleClickUpvote}>
            <Ionicons
              name="md-arrow-round-up"
              size={32}
              color={userVoteStatus === 1 ? 'orange' : 'gray'}
            />
          </TouchableHighlight>
          <Text style={styles.titleText}>{this.state.voteTotal}</Text>
          <TouchableHighlight onPress={this.handleClickDownvote}>
            <Ionicons
              name="md-arrow-round-down"
              size={32}
              color={userVoteStatus === -1 ? 'orange' : 'gray'}
            />
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '80%%',
            alignItems: 'center',
          }}>
          {isEditable && (
            <TouchableHighlight onPress={this.openEditDescription}>
              <Ionicons name="md-create" size={28} color="gray" style={styles.iconStyle} />
            </TouchableHighlight>
          )}
          <TouchableHighlight onPress={this.share}>
            <Ionicons name="md-share" size={32} color="gray" />
          </TouchableHighlight>
          <TouchableHighlight onPress={this.handleClickFav}>
            <Ionicons
              name="md-heart"
              size={32}
              color={this.props.user.favs[this.state.phototag.id] ? 'red' : 'gray'}
            />
          </TouchableHighlight>
        </View>
        <Text style={styles.authorContainer}>
          <Image
            style={styles.imageSetting}
            source={{
              uri: this.state.authorPhoto,
            }}
          />
          <Text>
            Posted by {this.state.authorName}, {moment(this.state.phototag.timestamp).fromNow()}
          </Text> 
        </Text>
        <View>
          <TouchableHighlight onPress={this.toggleSolutionsModal}>
            <Ionicons name="md-list" size={32} color="gray" />
          </TouchableHighlight>
          <PhotoTagSolutions
            style={{ height: '75%' }}
            toggleSolutionsModal={this.toggleSolutionsModal.bind(this)}
            modalSolutionsVis={this.state.modalSolutionsVis}
            phototag={this.state.phototag}
            userId={this.props.user.id}
          />
          <TouchableHighlight onPress={this.solve}>
            <Ionicons name="md-flag" size={32} color="gray" />
          </TouchableHighlight>
        </View>
        <Text style={styles.titleText}>Comments</Text>
        {this.state.comments.map((comment, i) => (
          <Comment
            key={comment.id}
            comment={comment}
            userId={this.props.user.id}
            notifyDeleted={this.notifyDeletedComment}
          />
        ))}
        <TextInput
          value={this.state.comment}
          placeholder="Enter a new comment"
          onChangeText={text => this.editComment(text)}
          clearButtonMode={'always'}
          style={styles.commentInput}
        />
        <Button title="Submit comment" onPress={this.handleSubmitComment} />
        {this.state.phototag.reps && (
          <Button title="View government contact info" onPress={this.goToElectedOfficials} />
        )}
      </KeyboardAwareScrollView>
    );
  }
}

//<PhotoTagSolutions style={{height: '75%',}} toggleSolutionsModal={this.toggleSolutionsModal.bind(this)} modalSolutionsVis={this.state.modalSolutionsVis}/>

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: '#FBF8F5',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    alignItems: 'center',
  },
  commentInput: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
  },
  photoDisplayContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  authorContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 10,
    width: '80%',
  },
  imageSetting: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
  iconStyle: {
    backgroundColor: '#FBF8F5',
  },
  descriptionInput: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapPhotoTagScreen);
