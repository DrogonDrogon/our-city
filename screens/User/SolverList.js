import React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import db from '../../db';
import solverItem from '../../components/solverItem';

class SolverList extends React.Component {
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
      <FlatList
        data={this.props.solutions}
        renderItem={({ item }) => <solverItem navigation={this.props.navigation} phototag={item} goToSolver={this.goToSolver.bind(this, item)}/>}
        keyExtractor={this._keyExtractor}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    );
  }
}

export default SolverList;
