import React from 'react';
import { FlatList, View, Text, Image, Alert, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import db from '../../db';
import solverItem from '../../components/solverItem';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
};

class SolverList extends React.Component {
  state={
    solutions: [],
  };
  _keyExtractor = (item, index) => item.id;

  goToSolver(item) {
    console.log('This listview item = ', item);
    this.props.navigation.navigate('SolverScreen', item);
  }

  _onPressItem = id => {
    // this.setState(state => {
    //   const selected =
    // })
  };
  render() {
    return (
      <View>
        <Text>Your Solutions</Text>
        <FlatList
          data={this.state.solutions}
          renderItem={({ item }) => <solverItem navigation={this.props.navigation} phototag={item} goToSolver={this.goToSolver.bind(this, item)}/>}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ alignItems: 'center' }}
        />
        </View>
    );
  }
}

export default connect(mapStateToProps)(SolverList);
