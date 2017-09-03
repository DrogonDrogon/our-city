import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { StyleSheet, Text, TextInput, Button, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import PhototDisplay from '../../components/PhotoDisplay';
import Comment from '../../components/comment';
import * as Actions from '../../actions';

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
      // dispatch(Actions.updateUser(user));
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
    // saveComment: (phototag, userId) => {
    //   // creates a new comment under 'comments'
    //   // adds the commentId under the user's 'comments'
    //   // adds the commentId under the phototag's 'comments'
    // },
  };
};

class MapScreen extends React.Component {
  state = {
    comment: '',
    votes: this.props.navigation.state.params.upvotes,
    phototag: this.props.navigation.state.params,
    edited: false,
    comments: this.props.navigation.state.params.comments,
  };

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

  handleClickFav() {
    if (!this.props.user.favs[this.state.phototag.id]) {
      this.props.addFavUnderUserId(this.props.user.id, this.state.phototag.id);
    } else {
      this.props.deleteFavUnderUserId(this.props.user.id, this.state.phototag.id);
    }
  }

  editComment(text) {
    this.setState({ comment: text });
  }
  addTocomments() {
    if (this.state.comment !== '') {
      console.log('this.state.comments', this.state.comments);
      let tempComments = this.state.comments;
      let commentObject = {
        userId: this.props.user.id,
        text: this.state.comment,
        timestamp: new Date(),
      };
      tempComments.push(commentObject);
      console.log('[addToComments]', commentObject);
      this.setState({ comments: tempComments });
      this.setState({ comment: '' });
    }
  }

  saveChanges() {
    console.log('save');
    let phototag = this.state.phototag;
    phototag.upvotes = this.state.votes;
    phototag.comments = this.state.comments;
    this.props.updatePhototagAndUser(phototag, this.props.user.id);
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <PhototDisplay phototag={this.state.phototag} />
        <TouchableHighlight onPress={this.handleClickFav.bind(this)}>
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
        <TextInput
          value={this.state.comment}
          placeholder="Enter comment"
          onChangeText={text => this.editComment(text)}
          clearButtonMode={'always'}
        />
        <Button title="submit comment" onPress={this.addTocomments.bind(this)} />
        <Button title="save changes" onPress={this.saveChanges.bind(this)} />
        <Text style={styles.titleText}>Comments</Text>

        {this.state.comments.map((comment, i) => (
          <Comment key={i} userName={this.state.phototag.userName} comment={comment} />
        ))}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
