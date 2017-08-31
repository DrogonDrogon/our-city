import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import * as Actions from '../../actions';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Expo from 'expo';
import firebase from 'firebase';
import db from '../../db';
import FilterTag from './<FilterTag></FilterTag>.js'

const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
  };
};

class FilterScreen extends Component {

state = {
    comment: '',
    numResults: 50,
    radius: 500,
    favories: false,
    tags: [],
  };


  render(){
    return(
      <ScrollView>
        <ScrollView>
        {this.state.tags.map((tag, i) => (
            <FilterTag key={i} tag={tag} />
          ))}
        </ScrollView>
        <View>
          <Slider
           style={{ width: 300 }}
           step={1}
           minimumValue={}
           maximumValue={71}
           value={this.state.age}
           onValueChange={val => this.setState({ age: val })}
           onSlidingComplete={ val => this.getVal(val)}
          />
          <Slider
           style={{ width: 300 }}
           step={1}
           minimumValue={18}
           maximumValue={71}
           value={this.state.age}
           onValueChange={val => this.setState({ age: val })}
           onSlidingComplete={ val => this.getVal(val)}
          />
        </View>
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