import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import PhototagItem from '../components/PhototagItem';
import * as Actions from '../redux/actions';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isPosting: state.isPosting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: (phototag, user) => {
      dispatch(Actions.postPhototagRequested(phototag));
      dispatch(Actions.postNewUserBegin(user));
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
  };

  upvote() {
    if (!this.props.user.votes.hasOwnProperty(this.state.phototag.id)) {
      this.setState({ votes: this.state.votes + 1 });
      this.props.user.votes[this.state.phototag.id] = 1;
    }
  }

  unvote() {
    this.setState({ votes: this.state.votes - 1 }, () => {
      if (this.state.votes < 0) {
        this.setState({ votes: 0 });
      }
      delete this.props.user.votes[this.state.phototag.id];
      console.log('yes', this.props.user.votes[this.state.phototag.id]);
    });
  }
  //  wrong file saving for later
  // discriptionEdit(text) {
  //   let tempPhotoTag = this.state.phototag;
  //   tempPhotoTag.description = text;
  //   this.setState({ phototag: tempPhotoTag });
  //   this.setState({ edited: true });
  // }
  editComment(text) {
    this.setState({ comment: text });
  }
  addTocomments() {
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

  saveChanges() {
    console.log('save');
    let phototag = this.state.phototag;
    phototag.upvotes = this.state.votes;
    phototag.comments = this.state.comments;
    let user = this.props.user;
    this.props.submitOnePhototag(phototag, user);
  }

  render() {
    return (
      <ScrollView>
        <PhototagItem phototag={this.state.phototag} />
        <Text style={styles.titleText}>{this.state.votes}</Text>
        <Button title="upvote" onPress={this.upvote.bind(this)} />
        <Button title="unvote" onPress={this.unvote.bind(this)} />
        <TextInput
          value={this.state.comment}
          placeholder="Enter comment"
          onChangeText={text => this.editComment(text)}
          clearButtonMode={'always'}
        />
        <Button title="submit comment" onPress={this.addTocomments.bind(this)} />
        <Text style={styles.titleText}>Comments</Text>
        {this.state.comments.map((comment, i) => (
          <View key={i}>
            <Text style={styles.titleText}>{this.state.phototag.userName}</Text>
            <Text style={styles.titleText}>{comment.text}</Text>
            <Text style={styles.titleText}>{moment(comment.timeStamp).fromNow()}</Text>
          </View>
        ))}
        <Button title="save changes" onPress={this.saveChanges.bind(this)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
