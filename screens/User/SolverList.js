import React from 'react';
import { FlatList, Text, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import db from '../../db';
import SolverItem from '../../components/solverItem';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
};

class SolverList extends React.Component {
  state = {
    solutions: [],
  };

  _keyExtractor = (item, index) => item.id;

  componentDidMount() {
    this.fetchSolutionsByUserId(this.props.user.id);
  }

  goToSolver(item) {
    console.log('This listview item = ', item);
    this.props.navigation.navigate('SolverScreen', item);
  }

  fetchSolutionsByUserId = userId => {
    let solutionIds;
    // get all solution ids for one phototag
    db
      .child('users/' + userId + '/solutions')
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
              }
            });
            console.log('Received all solutions', validEntries);
            this.setState({
              solutions: validEntries,
            });
          })
          .catch(err => {
            console.log('Error getting solutions from userId', err);
          });
      });
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <Text>Your Solutions</Text>
        <FlatList
          data={this.state.solutions}
          renderItem={({ item }) => (
            <SolverItem solution={item} goToSolver={this.goToSolver.bind(this, item)} />
          )}
          keyExtractor={this._keyExtractor}
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(mapStateToProps)(SolverList);
