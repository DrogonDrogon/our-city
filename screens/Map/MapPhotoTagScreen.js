import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import Comment from '../../components/comment';
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
    updatePhototagAndUser: (phototag, userId) => {
      dispatch(Actions.updateFavsOrVotesOfPhototag(phototag, userId));
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
    updateUserWithComment: userData => {
      dispatch(Actions.updateUser(userData));
    },
  };
};

class MapScreen extends React.Component {
  state = {
    comment: '',
    votes: this.props.navigation.state.params.upvotes,
    phototag: this.props.navigation.state.params,
    edited: false,
    comments: [],
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

  upvote() {
    if (
      !this.props.user.votes.hasOwnProperty(this.state.phototag.id) ||
      this.props.user.votes[this.state.phototag.id] === 0
    ) {
      this.setState({ votes: this.state.votes + 1 });
      this.props.user.votes[this.state.phototag.id] = 1;
    }
  }

  unvote() {
    if (
      this.props.user.votes.hasOwnProperty(this.state.phototag.id) &&
      this.props.user.votes[this.state.phototag.id] === 1
    ) {
      this.props.user.votes[this.state.phototag.id] = 0;
      this.setState({ votes: this.state.votes - 1 });
    }
  }

  submitVotes() {
    console.log('submit votes');
    let phototag = this.state.phototag;
    phototag.upvotes = this.state.votes;
    phototag.comments = this.state.comments;
    this.props.updatePhototagAndUser(phototag, this.props.user.id);
  }

  handleClickFav = () => {
    if (!this.props.user.favs[this.state.phototag.id]) {
      this.props.addFavUnderUserId(this.props.user.id, this.state.phototag.id);
    } else {
      this.props.deleteFavUnderUserId(this.props.user.id, this.state.phototag.id);
    }
  };

  editComment(text) {
    this.setState({ comment: text });
  }

  handleSubmitComment = () => {
    if (this.state.comment !== '') {
      let tempComments = this.state.comments;
      let commentObject = {
        userId: this.props.user.id,
        userName: this.props.user.displayName,
        userImage: this.props.user.photoUrl,
        text: this.state.comment,
        timestamp: new Date(),
      };
      tempComments.push(commentObject);
      this.setState({ comments: tempComments });
      this.setState({ comment: '' });

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
    // console.log('commentRecord', commentRecord);

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
    this.props.updateUserWithComment(updatedUser);

    // 3. Adds the commentId under the phototag 'comments' node
    this.props.updatePhototagWithComment(phototagId, commentId);
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.photoDisplayContainer}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.state.phototag.imageUrl }}
          />
          <Text>{this.state.phototag.description}</Text>
        </View>
        <Text style={styles.authorContainer}>
          <Image
            style={styles.imageSetting}
            source={{
              uri:
                this.state.authorPhoto ||
                'https://upload.wikimedia.org/wikipedia/commons/4/41/NYC_Skyline_Silhouette.png',
            }}
          />
          <Text>
            Posted by {this.state.authorName}, {moment(this.state.phototag.timestamp).fromNow()}
          </Text>
        </Text>
        <TouchableHighlight onPress={this.handleClickFav}>
          <Ionicons
            name="md-heart"
            size={32}
            color={this.props.user.favs[this.state.phototag.id] ? 'red' : 'black'}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.upvote.bind(this)}>
          <Ionicons name="md-arrow-up" size={32} color="blue" />
        </TouchableHighlight>
        <Text style={styles.titleText}>{this.state.votes}</Text>
        <TouchableHighlight onPress={this.unvote.bind(this)}>
          <Ionicons name="md-arrow-down" size={32} color="blue" />
        </TouchableHighlight>
        <Button title="Submit votes" onPress={this.submitVotes.bind(this)} />
        <Text style={styles.titleText}>Comments</Text>
        {this.state.comments.map((comment, i) => <Comment key={comment.id} comment={comment} />)}
        <TextInput
          value={this.state.comment}
          placeholder="Enter a new comment"
          onChangeText={text => this.editComment(text)}
          clearButtonMode={'always'}
          style={styles.commentInput}
        />
        <Button title="Submit comment" onPress={this.handleSubmitComment} />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 50,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
