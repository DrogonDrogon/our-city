import React from 'react';
import { ScrollView, FlatList, StatusBar, Text, Image, Modal, Button } from 'react-native';
import CustomButton from './Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import PhototagSolutionItem from './phototagSolutionItem';
import db from '../db';
import AppStyles from '../styles/AppStyles';

// Settings for the ActionSheet
const WARNING_INDEX = 0;
const CANCEL_INDEX = 1;
const options = ['Confirm', 'Cancel'];
const title = 'Mark this solution as best?';

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
    this.props.navigation.navigate('ViewSolverScreen', item);
    this.props.toggleSolutionsModal();
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

  confirmMarkSolution = solutionId => {
    console.log('confimring solution', solutionId);
    this.setState({ solutionIdToMark: solutionId }, () => {
      this.ActionSheet.show();
    });
  };

  handleActionSheetPress = (selectedIndex, solutionId) => {
    if (selectedIndex === WARNING_INDEX) {
      this.editSolutionWithIdAndStatus(this.state.solutionIdToMark, true);
    }
  };

  handleMarkSelected = solutionId => {
    this.editSolutionWithIdAndStatus(solutionId, true);
  };

  render() {
    StatusBar.setBarStyle('none');

    return (
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={this.props.modalSolutionsVis}
        onRequestClose={() => {}}>
        <Image
          style={{ height: '100%', width: '100%' }}
          source={require('../assets/images/manyBulbs.png')}
          resizeMode="cover">
          <ScrollView>
            <FlatList
              data={this.state.solutions}
              renderItem={({ item }) => (
                <PhototagSolutionItem
                  goToSolver={this.goToSolver.bind(this, item)}
                  navigation={this.props.navigation}
                  solution={item}
                  isOneAccepted={this.state.isOneAccepted}
                  isOwner={this.state.isOwner}
                  confirmMarkSolution={this.confirmMarkSolution}
                />
              )}
              keyExtractor={this._keyExtractor}
            />
          </ScrollView>
          <ActionSheet
            ref={sheet => (this.ActionSheet = sheet)}
            title={title}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={WARNING_INDEX}
            onPress={this.handleActionSheetPress}
          />
          <CustomButton label="Close"
            onPress={this.props.toggleSolutionsModal}
            styles={{ button: AppStyles.actionButton, label: AppStyles.buttonWhiteText }}
          />
        </Image>
      </Modal>
    );
  }
}

export default PhotoTagSolutions;
