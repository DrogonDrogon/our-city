import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import db from '../db';
import AppStyles from '../styles/AppStyles';

class PhototagSolutionItem extends React.Component {
  state = {
    authorName: '',
    authorPhoto: '',
  };

  componentDidMount() {
    this.getAuthor(this.props.solution.userId);
  }

  getAuthor(userId) {
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

  render() {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text>{this.props.solution.description}</Text>
        <Image
          style={{ width: 100, height: 100, resizeMode: Image.resizeMode.contain }}
          source={{
            uri: this.props.solution.imageUrl,
          }}
        />
        <Text>Suggested by {this.state.authorName}</Text>
        <Button title="View" onPress={this.props.goToSolver} />
        {this.props.isOwner &&
        this.props.isOneAccepted === false && (
          <Button
            title="Mark as Chosen"
            onPress={() => this.props.handleMarkSelected(this.props.solution.id)}
          />
        )}
        {this.props.isOneAccepted === true &&
        this.props.solution.isAccepted && <Text style={{ color: 'green' }}>Marked as best</Text>}
      </View>
    );
  }
}

export default PhototagSolutionItem;
