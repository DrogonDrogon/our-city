import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, TextInput, View, Button , Slider, TouchableHighlight, Modal} from 'react-native';
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
      numResults: 25,
      radius: .50,
      favories: false,
      tags: ['trees', 'potholes', 'bench', 'garden', 'sidewalk', 'transit', 'art'],
      modalVisible: false,
      };
  }
  getVal(val){
  
  }

 setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render(){
    return(
      <View style={{ marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Filters has been closed.")}}
          >
          <View style={{ marginTop: 22 }}>
            <View>
              <TouchableHighlight onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text>Hide Filters</Text>
              </TouchableHighlight>
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
                    step={0.10}
                    minimumValue={0.10}
                    maximumValue={10.0}
                    value={this.state.radius}
                    onValueChange={val => this.setState({ radius: val.toPrecision(2) })}
                    onSlidingComplete={ val => this.getVal(val)}
                  />
                  <Text>Distance(miles): {this.state.radius}</Text>
                  <Slider
                    style={{ width: 300 }}
                    step={1}
                    minimumValue={10}
                    maximumValue={50}
                    value={this.state.numResults}
                    onValueChange={val => this.setState({ numResults: val })}
                    onSlidingComplete={ val => this.getVal(val)}
                  />
                  <Text>Results: {this.state.numResults}</Text>
                </View>
                <View>

                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <TouchableHighlight style={{ zIndex: 2}} onPress={() => {
            this.setModalVisible(true)
          }}>
          <Text>Filters</Text>
        </TouchableHighlight>
        </View>
      )
  }
}

export default FilterScreen;

//need an option for favorites
//need a selector for recent, popular, most voted, most faved
//need to allow selection by tag (check marks?)
//allow for different zoom levels?