import React from 'react';
import { FlatList, View, Text, Image, Modal, Alert, TouchableHighlight} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import db from '../db';
import SolverItem from './solverItem';

// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.user,
//   };
// };

class PhotoTagSolutions extends React.Component {
  state={
    solutions: [],
  };

  _keyExtractor = (item, index) => item.id;

  goToSolver(item) {
    console.log('This listview item = ', item);
    this.props.navigation.navigate('SolverScreen', item);
  }

  render() {
    
    return (
      <Modal
        style={{height: '75%',}}
        animationType={'slide'}
        transparent={false}
        visible={this.props.modalSolutionsVis}
        onRequestClose={() => {}}>
        <TouchableHighlight onPress={this.props.toggleSolutionsModal}>
          <Ionicons name="md-close" size={32} color="gray" />
        </TouchableHighlight>
        <View>
          <Text>Completed Solutions</Text>
          <FlatList
           data={this.state.solutions}
           renderItem={({ item }) => <SolverItem navigation={this.props.navigation} phototag={item} goToSolver={this.goToSolver.bind(this, item)}/>}
           keyExtractor={this._keyExtractor}
           contentContainerStyle={{ alignItems: 'center' }}
         />
        </View>
      </Modal>  
    );
  }
}



export default PhotoTagSolutions;