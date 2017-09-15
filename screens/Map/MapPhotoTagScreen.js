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
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import Comment from '../../components/comment';
import PhotoTagSolutions from '../../components/photoTagSolutions';
import TaggedText from '../../components/TaggedText';
import EditPhototagModal from '../../components/editPhototagModal';
import * as Actions from '../../actions';
import db from '../../db';
import AppStyles from '../../styles/AppStyles.js';

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
    deleteFavUnderUserId: (userId, phototagId, badgeCount) => {
      dispatch(Actions.deleteFavUnderUserId(userId, phototagId, badgeCount));
    },
    updatePhototagWithComment: (phototagId, commentId, badgeCount) => {
      let newCommentRecord = {};
      let key = commentId;
      newCommentRecord[key] = true;
      dispatch(Actions.addCommentUnderPhototag(phototagId, newCommentRecord, badgeCount));
    },
    updateUser: userData => {
      dispatch(Actions.updateUser(userData));
    },
    deleteOneComment: (commentId, userData, photoId) => {
      dispatch(Actions.deleteComment(commentId, userData, photoId));
    },
    getAllCommentsByUser: user => {
      dispatch(Actions.getAllCommentsByUser(user));
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
    modalEditVis: false,
    modalActionVis: false,
    modalSolutionsVis: false,
    modalNavRightButton: {
      title: 'Save',
      handler: () => {
        this.saveDescription(this.state.editedDescription);
        this.toggleEditModal();
      },
    },
    modalNavLeftButton: {
      title: 'Cancel',
      handler: () => {
        this.toggleEditModal();
      },
    },
    editedDescription: this.props.navigation.state.params.description,
  };

  componentDidMount() {
    let currentPhototag = this.props.navigation.state.params;
    this.getCommentsFromArrayOfCommentIds(Object.keys(currentPhototag.comments));
    this.getAuthorForCurrentPhototag(currentPhototag.userId);
  }

  getCommentsFromArrayOfCommentIds(commentKeys) {
    // console.log('THIS COMMENTS -->', this.props.navigation.state.params.comments); // this is an object containing commentIds
    // Run the firebase query for comments here.
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
        this.setState({ comments: validComments }, () => {
          console.log('got comments for current phototag');
        });
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
    let updatedPhototag = Object.assign({}, this.state.phototag);
    // If user does not have this favorite, add
    if (!this.props.user.favs[this.state.phototag.id]) {
      this.props.addFavUnderUserId(this.props.user.id, this.state.phototag.id);
      updatedPhototag.favTotal += 1;
      updatedPhototag.badges += 1;
      this.props.updatePhototag(updatedPhototag);
      this.setState({
        phototag: updatedPhototag,
      });
    } else {
      // If user does already have this favorite, remove
      this.props.deleteFavUnderUserId(this.props.user.id, this.state.phototag.id);
      updatedPhototag.favTotal -= 1;
      this.props.updatePhototag(updatedPhototag);
      this.setState({
        phototag: updatedPhototag,
      });
    }
    axios
      .post('https://notification-server-walter.herokuapp.com/notification', {
        message: `someone liked your tag with description "${this.state.phototag.description}"`,
        userid: this.state.phototag.userId,
      })
      .then(res => {
        console.log(res.data);
      });
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
    axios
      .post('https://notification-server-walter.herokuapp.com/notification', {
        message: `someone commented "${this.state.comment}" on on your tag  "${this.state.phototag
          .description}"`,
        userid: this.state.phototag.userId,
      })
      .then(res => {
        console.log('Notification post success', res.data);
        this.props.updatePhototagWithComment(phototagId, commentId, this.state.phototag.badges + 1);
      })
      .catch(err => {
        console.log('Notification post err', err);
        this.props.updatePhototagWithComment(phototagId, commentId, this.state.phototag.badges + 1);
      });
  };

  share = () => {
    Share.share({
      title: this.state.phototag.description,
      message: this.state.phototag.description,
      url: this.state.phototag.imageUrl,
    });
  };

  solve = () => {
    this.props.navigation.navigate('SolverScreen', {
      phototag: Object.assign({}, this.state.phototag),
    });
  };

  goToElectedOfficials = () => {
    let phototagData = this.state.phototag;
    this.props.navigation.navigate('electedOfficials', { phototag: phototagData });
  };

  notifyDeletedComment = (commentId, userData, photoId) => {
    // Once a comment is deleted, this component is notified and refreshes UI by getting the latest comments again
    this.props.deleteOneComment(commentId, this.props.user, photoId);
    let commentsCopy = this.state.comments.slice();
    let savedCommentIds = [];
    for (var i = 0; i < commentsCopy.length; i++) {
      if (commentsCopy[i].id !== commentId) {
        savedCommentIds.push(commentsCopy[i].id);
      }
    }
    this.getCommentsFromArrayOfCommentIds(savedCommentIds);
  };

  openEditDescription = () => {
    console.log('Editing description');
    this.toggleEditModal();
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

  toggleEditModal = () => {
    this.setState({ modalEditVis: !this.state.modalEditVis });
  };

  toggleSolutionsModal = () => {
    this.setState({ modalSolutionsVis: !this.state.modalSolutionsVis });
  };

  toggleActionModal = () => {
    this.setState({ modalActionVis: !this.state.modalActionVis });
  };

  render() {
    let isEditable = this.props.user.id === this.state.phototag.userId;
    let userVoteStatus = this.props.user.votes[this.state.phototag.id];

    return (
      <Image
          style={{ height: '100%', width: '100%',  alignItems: 'center', backgroundColor: 'black' }}
          source={require('../../assets/images/water.png')}
          resizeMode="cover">
        <KeyboardAwareScrollView contentContainerStyle={[AppStyles.scrollViewContainer, {backgroundColor:'transparent'}]}>
          <View style={AppStyles.photoDisplayContainer}>
            <Image style={AppStyles.phototagImage} source={{ uri: this.state.phototag.imageUrl }} />
          </View>
          <View style={AppStyles.authorContainer}>
            <TaggedText
              navigation={this.props.navigation}
              text={this.state.phototag.description}
              style={AppStyles.descriptionContainerView}
            />
            {isEditable && (
              <TouchableHighlight onPress={this.openEditDescription} underlayColor="transparent">
                <Ionicons name="md-create" size={28} color="white" />
              </TouchableHighlight>
            )}
          </View>
          <Image source={{ uri: this.state.authorPhoto }} style={AppStyles.imageSetting} />
          <Text style={AppStyles.authorNameText}>{this.state.authorName}</Text>
          <Text style={AppStyles.dateText}>{moment(this.state.phototag.timestamp).fromNow()}</Text>
          <View style={{ flex: 1, flexDirection: 'column' }} />
          <View style={AppStyles.horizontalDisplay}>
            <TouchableHighlight onPress={this.handleClickUpvote} underlayColor="transparent">
              <Ionicons
                name="md-arrow-dropup"
                size={32}
                color={userVoteStatus === 1 ? 'orange' : 'white'}
              />
            </TouchableHighlight>
            <Text style={AppStyles.titleText}>{this.state.voteTotal}</Text>
            <TouchableHighlight onPress={this.handleClickDownvote} underlayColor="transparent">
              <Ionicons
                name="md-arrow-dropdown"
                size={32}
                color={userVoteStatus === -1 ? 'orange' : 'white'}
              />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.share} underlayColor="#ccc">
              <Ionicons name="ios-share-outline" size={32} color="white" />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.handleClickFav} underlayColor="transparent">
              <Ionicons
                name="md-heart"
                size={32}
                color={this.props.user.favs[this.state.phototag.id] ? 'red' : 'white'}
              />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.toggleActionModal} underlayColor="transparent">
              <Ionicons name="md-list" size={32} color="white" />
            </TouchableHighlight>
          </View>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.modalActionVis}
            onRequestClose={() => {}}> 
            <View style={{backgroundColor: 'transparent', height: '100%', alignItems: 'center', justifyContent:'center', flexDirection:'column'}}>
              <View style={[AppStyles.container, {alignSelf: 'center', backgroundColor:'white'}]}>
                <View style={{flexDirection:'row', justifyContent: 'flex-start'}}>  
                  <TouchableHighlight onPress={this.toggleActionModal} underlayColor="transparent">
                    <Ionicons name="md-close-circle" size={32} color="grey" />
                  </TouchableHighlight>
                </View>
                <View style={{justifyContent: 'flex-start', height: 100}}>
                  {this.state.phototag.reps && (
                    <View style={AppStyles.horizontalDisplayNoSpace}>
                      <TouchableHighlight onPress={()=> {this.toggleActionModal(); this.goToElectedOfficials()}} underlayColor="transparent">
                        <Ionicons name="md-contacts" size={32} color="grey" />
                      </TouchableHighlight>
                      <Button title="Contact an official" onPress={this.goToElectedOfficials} />
                    </View>
                  )}
                  <View style={AppStyles.horizontalDisplayNoSpace}>
                    <TouchableHighlight onPress={this.solve} underlayColor="#ccc">
                      <Ionicons name="md-bulb" size={32} color="grey" />
                    </TouchableHighlight>
                    <Button title="Volunteer a fix" onPress={()=> {this.toggleActionModal(); this.solve()}} />
                  </View>
                  <View style={AppStyles.horizontalDisplayNoSpace}>
                  <TouchableHighlight onPress={this.toggleSolutionsModal} underlayColor="transparent">
                    <Ionicons name="md-cog" size={32} color="grey" />
                  </TouchableHighlight>
                    <Button title="View suggested fixes" onPress={()=> {this.toggleActionModal(); this.toggleSolutionsModal()}} />
                  </View>
                </View>  
              </View>
            </View>  
          </Modal>
          <Text style={AppStyles.titleText}>Comments</Text>
          {this.state.comments.map((comment, i) => (
            <Comment
              key={comment.id}
              comment={comment}
              userId={this.props.user.id}
              notifyDeletedComment={this.notifyDeletedComment}
            />
          ))}
          <View style={AppStyles.horizontalDisplay}>
            <TextInput
              value={this.state.comment}
              placeholder="Type a comment..."
              onChangeText={text => this.editComment(text)}
              clearButtonMode={'always'}
              style={AppStyles.commentInput}
            />
            <TouchableHighlight onPress={this.handleSubmitComment} underlayColor="#ccc">
              <Ionicons name="md-send" size={32} color="gray" />
            </TouchableHighlight>
          </View>
          
          <PhotoTagSolutions
            style={{ height: '75%' }}
            navigation={this.props.navigation}
            toggleSolutionsModal={this.toggleSolutionsModal}
            modalSolutionsVis={this.state.modalSolutionsVis}
            phototag={this.state.phototag}
            userId={this.props.user.id}
          />
          <EditPhototagModal
            toggleEditModal={this.modalEditVis}
            modalEditVis={this.state.modalEditVis}
            phototag={this.state.phototag}
            modalNavRightButton={this.state.modalNavRightButton}
            modalNavLeftButton={this.state.modalNavLeftButton}
            editedDescription={this.state.editedDescription}
            editDescription={this.editDescription}
          />
        </KeyboardAwareScrollView>
      </Image>  
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapPhotoTagScreen);
