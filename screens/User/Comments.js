import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import PhototagItem from '../../components/PhototagItem';
import UserOwnComment from '../../components/UserOwnComment';
import db from '../../db';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

class Comments extends React.Component {
  state = {
    comments: [],
  };

  _keyExtractor = (item, index) => item.id;

  componentDidMount() {
    // do fetch here for user comments
    this.getCommentsForUser();
  }

  goToPhototagsDetail = item => {
    this.props.navigation.navigate('PhototagFromMap', item);
  };

  getCommentsForUser = () => {
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
        validComments.forEach(comment => {
          db
            .child('phototags/' + comment.phototagId)
            .once('value')
            .then(snapshot => {
              comment.phototagData = snapshot.val();
              this.setState({ comments: validComments });
            });
        });
      })
      .catch(err => console.log('Err getting phototags', err));
  };

  render() {
    return (
      <View>
        <Text style={styles.titleText}>My Comments</Text>
        <FlatList
          data={this.state.comments}
          renderItem={({ item }) => <UserOwnComment comment={item} goToPhototags={this.goToPhototagsDetail.bind(this, item.phototagData)} />}
          keyExtractor={this._keyExtractor}
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

export default connect(mapStateToProps)(Comments);
