import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TextInput, View, Button , Slider} from 'react-native';
import * as Actions from '../../actions';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Expo from 'expo';
import firebase from 'firebase';
import db from '../../db';
import FilterTag from '../../components/FilterTag.js';

const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
  };
};

class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedTags: [],
        numResults: 50,
        radius: .5,
        favories: false,
        tags: ['trees', 'potholes', 'bench', 'garden', 'sidewalk', 'transit', 'art'],
      };
  }
  getVal(val){
  console.warn(val);
  }

  Select

  render(){
    return(
      <ScrollView>
        <ScrollView>
          <View> 
            {this.state.tags.map((tag, i) => (
                <FilterTag key={i} tag={tag} />
              ))}
          </View>
        </ScrollView>
        <View>
          <Slider
            style={{ width: 300 }}
            step={0.25}
            minimumValue={0.25}
            maximumValue={10}
            value={this.state.radius}
            onValueChange={val => this.setState({ radius: val })}
            onSlidingComplete={ val => this.getVal(val)}
          />
          <Slider
            style={{ width: 300 }}
            step={1}
            minimumValue={10}
            maximumValue={100}
            value={this.state.numResults}
            onValueChange={val => this.setState({ numResults: val })}
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