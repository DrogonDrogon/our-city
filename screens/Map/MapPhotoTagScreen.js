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
  Alert,
  Share,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import Comment from '../../components/comment';
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
    votes: this.props.navigation.state.params.upvotes,
    phototag: this.props.navigation.state.params,
    edited: false,
    comments: [],
    tempCommentId: 0,
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

  handleUpvote = () => {
    if (
      !this.props.user.votes.hasOwnProperty(this.state.phototag.id) ||
      this.props.user.votes[this.state.phototag.id] === 0
    ) {
      this.setState({ votes: this.state.votes + 1 }, () => {
        // Update user
        let userData = this.props.user;
        userData.votes[this.state.phototag.id] = 1;
        this.props.updateUser(userData);

        // Update phototag
        let phototagData = this.state.phototag;
        phototagData.upvotes = this.state.votes;
        this.props.updatePhototag(phototagData);
      });
    } else {
      Alert.alert(
        'Note',
        'You have already submitted 1 vote for this! To remove your vote, click the down button'
      );
    }
  };

  handleUndoUpvote = () => {
    if (
      this.props.user.votes.hasOwnProperty(this.state.phototag.id) &&
      this.props.user.votes[this.state.phototag.id] === 1
    ) {
      this.setState({ votes: this.state.votes - 1 }, () => {
        // Update user
        let userData = this.props.user;
        userData.votes[this.state.phototag.id] = 0;
        this.props.updateUser(userData);

        // Update phototag
        let phototagData = this.state.phototag;
        phototagData.upvotes = this.state.votes;
        this.props.updatePhototag(phototagData);
      });
    }
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

  share() {
    Share.share({
      title: this.state.phototag.description,
      message: this.state.phototag.description,
      url: this.state.phototag.imageUrl,
    });
  }

  goToElectedOfficials() {
    let phototagData = this.state.phototag;
    this.props.navigation.navigate('electedOfficials', { phototag: phototagData });
  }

  notifyDeletedComment = () => {
    // Once a comment is deleted, this component is notified and refreshes UI by getting the latest comments again
    this.getCommentsForCurrentPhototag(this.props.navigation.state.params);
  };

  render() {
    // //define delimiter
    // let delimiter = /\s+/;

    // //split string
    // let _text = this.state.phototag.description;
    // let token,
    //   index,
    //   parts = [];
    // while (_text) {
    //   delimiter.lastIndex = 0;
    //   token = delimiter.exec(_text);
    //   if (token === null) {
    //     break;
    //   }
    //   index = token.index;
    //   if (token[0].length === 0) {
    //     index = 1;
    //   }
    //   parts.push(_text.substr(0, index));
    //   parts.push(token[0]);
    //   index = index + token[0].length;
    //   _text = _text.slice(index);
    // }
    // parts.push(_text);

    // //highlight hashtags
    // parts = parts.map(text => {
    //   if (/^#/.test(text)) {
    //     return (
    //       <Text onPress={() => console.log(text)} key={text} style={styles.hashtag}>
    //         {text}
    //       </Text>
    //     );
    //   } else {
    //     return text;
    //   }
    // });

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.photoDisplayContainer}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.state.phototag.imageUrl }}
          />
          <TaggedText text={this.state.phototag.description}/>
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
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <TouchableHighlight onPress={this.handleClickFav}>
            <Ionicons
              name="md-heart"
              size={32}
              color={this.props.user.favs[this.state.phototag.id] ? 'red' : 'black'}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={this.handleUpvote}>
            <Ionicons name="md-arrow-up" size={32} color="blue" />
          </TouchableHighlight>
          <Text style={styles.titleText}>{this.state.votes}</Text>
          <TouchableHighlight onPress={this.handleUndoUpvote}>
            <Ionicons name="md-arrow-down" size={32} color="blue" />
          </TouchableHighlight>
          <TouchableHighlight onPress={this.share.bind(this)}>
            <Ionicons name="md-share-alt" size={32} color="blue" />
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
          <Button
            title="View government contact info"
            onPress={this.goToElectedOfficials.bind(this)}
          />
        )}
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
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapPhotoTagScreen);
