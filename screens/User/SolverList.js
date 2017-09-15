import React from 'react';
import { FlatList, Text, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import db from '../../db';
import SolverItem from '../../components/solverItem';
import AppStyles from '../../styles/AppStyles';

const mapStateToProps = state => {
  return {
    user: state.user,
    solutions: state.solutions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSolutions: userId => {
      dispatch(Actions.fetchSolutionsByUserId(userId));
    },
  };
};

class SolverList extends React.Component {
  _keyExtractor = (item, index) => item.id;

  componentDidMount() {
    this.props.getSolutions(this.props.user.id);
  }

  goToSolver(item) {
    console.log('This listview item = ', item);
    this.props.navigation.navigate('ViewSolverScreen', item);
  }

  render() {
    return (
      <Image
        style={{ height: '100%', width: '100%' }}
        source={require('../../assets/images/manyBulbs.png')}
        resizeMode="cover">
        <KeyboardAwareScrollView>
          <Text
            style={{
              color: 'white',
              backgroundColor: 'transparent',
              alignSelf: 'center',
              fontSize: 20,
              marginBottom: 10,
            }}>
            Your Solutions
          </Text>
          <FlatList
            data={this.props.solutions}
            renderItem={({ item }) => (
              <SolverItem solution={item} goToSolver={this.goToSolver.bind(this, item)} />
            )}
            keyExtractor={this._keyExtractor}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </KeyboardAwareScrollView>
      </Image>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SolverList);
