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
    updatePhototagAndUser: (phototag, user) => {
      dispatch(Actions.postPhototagRequested(phototag));
      dispatch(Actions.updateUser(user));
    },
  };
};

class MapScreen extends React.Component {
  state = {
    comment: '',
    votes: this.props.navigation.state.params.upvotes,
    phototag: this.props.navigation.state.params,
    edited: false,
    comments: this.props.navigation.state.params.comments,
    favouriteBtn: this.props.user.favs[this.props.navigation.state.params.id] ? 'red' : 'black',
    isFavourite: 'false',
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

  addFavourite() {
    if (!this.state.isFavourite) {
      this.props.user.favs[this.state.phototag.id] = true;
      this.setState({ favouriteBtn: 'red' });
      this.setState({ isFavourite: true });
    } else {
      delete this.props.user.favs[this.state.phototag.id];
      this.setState({ favouriteBtn: 'black' });
      this.setState({ isFavourite: false });
    }
  }

  editComment(text) {
    this.setState({ comment: text });
  }
  addTocomments() {
    if (this.state.comment !== '') {
      console.log('logged');
      let tempComments = this.state.comments;
      let commentObject = {
        userName: this.props.user.displayName,
        text: this.state.comment,
        timeStamp: new Date(),
      };
      tempComments.push(commentObject);
      this.setState({ comments: tempComments });
      this.setState({ comment: '' });
    }
  }

  saveChanges() {
    console.log('save');
    let phototag = this.state.phototag;
    phototag.upvotes = this.state.votes;
    phototag.comments = this.state.comments;
    let user = this.props.user;
    this.props.updatePhototagAndUser(phototag, user);
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <PhototDisplay phototag={this.state.phototag} />
        <TouchableHighlight onPress={this.addFavourite.bind(this)}>
          <Ionicons name="md-heart" size={32} color={this.state.favouriteBtn} />
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
