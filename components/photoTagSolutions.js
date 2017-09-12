import React from 'react';
import { FlatList, View, Text, Image, Modal, Alert, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import PhototagSolutionItem from './phototagSolutionItem';
import db from '../db';

class PhotoTagSolutions extends React.Component {
  state = {
    solutions: [],
    isOneAccepted: false,
    isOwner: this.props.userId === this.props.phototag.userId,
  };

  componentDidMount() {
    this.fetchSolutionsByPhotoId(this.props.phototag.id);
  }

  _keyExtractor = (item, index) => item.id;

  goToSolver(item) {
    console.log('This Sollistview item = ', item);
    this.props.navigation.navigate('ViewSolverScreen', item);
  }

  fetchSolutionsByPhotoId = phototagId => {
    let solutionIds;
    // get all solution ids for one phototag
    db
      .child('phototags/' + phototagId + '/solutions')
      .once('value')
      .then(snapshot => {
        let snapshotObj = snapshot.val();
        solutionIds = Object.keys(snapshotObj);
        return solutionIds;
      })
      .then(keys => {
        // get all the solutions (objects) based on the array of solution ids
        const promises = keys.map(id => {
          return db
            .child('solutions/' + id)
            .once('value')
            .then(snapshot => {
              return snapshot.val();
            })
            .catch(err => {
              console.log('err', err);
            });
        });
        Promise.all(promises)
          .then(solutionData => {
            let validEntries = [];
            solutionData.forEach(item => {
              if (item) {
                validEntries.push(item);
                if (item.isAccepted) {
                  this.setState({
                    isOneAccepted: true,
                  });
                }
              }
            });
            console.log('Received all solutions', validEntries);
            this.setState({
              solutions: validEntries,
            });
          })
          .catch(err => {
            console.log('Error getting solutions from photoId', err);
          });
      });
  };

  editSolutionWithIdAndStatus = (solutionId, isAccepted) => {
    db
      .child('solutions/' + solutionId)
      .update({ isAccepted })
      .then(() => {
        console.log('Updated firebase solution id', solutionId);
        this.fetchSolutionsByPhotoId(this.props.phototag.id);
      })
      .catch(err => {
        console.log('Error updating solution as accepted', err);
      });
  };

  handleMarkSelected = solutionId => {
    this.editSolutionWithIdAndStatus(solutionId, true);
  };

  render() {
    return (
      <Modal
        style={{ top: 200 }}
        animationType={'slide'}
        transparent={false}
        visible={this.props.modalSolutionsVis}
        onRequestClose={() => {}}>
        <Text>Solutions</Text>
        <FlatList
          contentContainerStyle={{ flex: 1, alignItems: 'center' }}
          data={this.state.solutions}
          renderItem={({ item }) => (
            <PhototagSolutionItem
              goToSolver={this.goToSolver.bind(this, item)}
              navigation={this.props.navigation}
              solution={item}
              isOneAccepted={this.state.isOneAccepted}
              isOwner={this.state.isOwner}
              handleMarkSelected={this.handleMarkSelected}/>
          )}
          keyExtractor={this._keyExtractor}
        />
        <Button title="Close" onPress={this.props.toggleSolutionsModal} />
      </Modal>
    );
  }
}

export default PhotoTagSolutions;
