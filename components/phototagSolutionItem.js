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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.3)',
          paddingBottom: 10,
          paddingTop: 40,
        }}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            resizeMode: Image.resizeMode.contain,
          }}
          source={{
            uri: this.props.solution.imageUrl,
          }}
        />
        <Text style={AppStyles.solutionTextTitle}>{this.props.solution.description}</Text>
        <Text>
          <Text>Suggested by </Text>
          <Text style={AppStyles.solutionTextBold}>{this.state.authorName}</Text>
        </Text>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Button title="View" onPress={this.props.goToSolver} />
          {this.props.isOwner &&
          this.props.isOneAccepted === false && (
            <Button
              title="Mark as Chosen"
              onPress={() => this.props.confirmMarkSolution(this.props.solution.id)}
            />
          )}
          {this.props.isOneAccepted === true &&
          this.props.solution.isAccepted && (
            <Text style={AppStyles.solutionMarkedAsBest}>Marked as best</Text>
          )}
        </View>
      </View>
    );
  }
}

export default PhototagSolutionItem;
