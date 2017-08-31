import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import * as Actions from '../../actions';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Expo from 'expo';
import firebase from 'firebase';
import db from '../../db';

const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
  };
};

class FilterScreen extends Component {

state = {
    comment: '',
    votes: this.props.navigation.state.params.upvotes,
    phototag: this.props.navigation.state.params,
    edited: false,
    comments: this.props.navigation.state.params.comments,
  };

  
  render(){
    return(
      <ScrollView>
        <ScrollView>
        {this.state.comments.map((comment, i) => (
            <Comment key={i} userName={this.state.phototag.userName} comment={comment} />
          ))}
        </ScrollView>
        <Slider>
        </Slider>
        <Slider>
        </Slider>
        <View>
        </View>
      </ScrollView>
      )
  }
}

export default FilterScreen;

//need an option for favorites
//need a selector for recent, popular, most voted, most faved
//need to allow selection by tag (check marks?)
//allow for different zoom levels?
//change search radius