import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Picker,
  View,
  Switch,
  Slider,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import db from '../../db';
import Button from '../../components/Button';
import FilterTag from '../../components/FilterTag.js';
import AppStyles from '../../styles/AppStyles';

class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: [],
      numResults: 25,
      radius: 5.0,
      favorites: false,
      modalVisible: false,
      sortBy: 'Date',
      FavIsSelected: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedTags: nextProps.filters.selectedTags,
      numResults: nextProps.filters.numResults,
      radius: nextProps.filters.radius,
      favorites: nextProps.filters.favorites,
      sortBy: nextProps.filters.sortBy,
      FavIsSelected: nextProps.filters.FavIsSelected,
    });
  }

  getVal(val) {
    // this.setState({ radius: 8000 });
  }
  selectTag(val) {
    let tagList = this.state.selectedTags;

    tagList.includes(val) ? tagList.splice(tagList.indexOf(val), 1) : tagList.push(val);

    this.setState({ selectedTags: tagList });
  }
  getInitialState() {
    return {
      FavIsSelected: false,
    };
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View style={styles.touchableStyle}>
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Filters has been closed.');
          }}>
          <View style={{ marginTop: 75, backgroundColor: 'white', padding: 20 }}>
            <View>
              <Button
                label="Save & Close"
                onPress={() => {
                  this.props.getFilters(this.state);
                  this.setModalVisible(!this.state.modalVisible);
                }}
                styles={{ button: styles.hideFilterButton, label: styles.hideFilterTextLabel }}
              />
              <ScrollView style={{ height: '100%' }}>
                <ScrollView contentContainerStyle={{ height: '50%' }}>
                  <Text>Tags</Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}>
                    {this.props.tags
                      .sort((a, b) => {
                        return b - a;
                      })
                      .map((tag, i) => (
                        <FilterTag
                          key={i}
                          tag={tag}
                          selectTag={this.selectTag.bind(this)}
                          selectedTags={this.state.selectedTags}
                        />
                      ))}
                  </View>
                </ScrollView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '33%',
                  }}>
                  <Slider
                    style={{ width: 300 }}
                    step={0.1}
                    minimumValue={0.1}
                    maximumValue={50.0}
                    value={this.state.radius}
                    onValueChange={val => this.setState({ radius: Number(val.toPrecision(2)) })}
                    onSlidingComplete={val => this.getVal(val)}
                  />
                  <Text>Distance (km): {this.state.radius}</Text>
                  <Slider
                    style={{ width: 300 }}
                    step={1}
                    minimumValue={1}
                    maximumValue={50}
                    value={this.state.numResults}
                    onValueChange={val => this.setState({ numResults: val })}
                    onSlidingComplete={val => this.getVal(val)}
                  />
                  <Text>Results: {this.state.numResults}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Picker
                    style={styles.filterPickerStyle}
                    selectedValue={this.state.sortBy}
                    onValueChange={method => this.setState({ sortBy: method })}>
                    <Picker.Item label="Most Recent" value="Date" />
                    <Picker.Item label="Most Popular" value="Popular" />
                    <Picker.Item label="Most Voted" value="Votes" />
                    <Picker.Item label="Most Favorited" value="Favorites" />
                  </Picker>
                  <View
                    style={{
                      width: '50%',
                      flex: 1,
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text>Only Show Favorites</Text>
                    <Switch
                      onValueChange={value => this.setState({ FavIsSelected: value })}
                      style={{ marginBottom: 10 }}
                      value={this.state.FavIsSelected}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <TouchableHighlight
          style={styles.filterStyle}
          onPress={() => {
            this.props.genFilterTags();
            this.setModalVisible(true);
          }}
          underlayColor="#ccc">
          <View style={styles.wrap}>
          <MaterialIcons name="filter-list" size={22} color="white" style={{ marginRight: 5 }} />
            <Text style={styles.filterTextLabel}>Filter</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default FilterScreen;

const styles = {
  touchableStyle: {
    zIndex: 2,
    width: 100,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'coral',
  },
  filterStyle: {
    width: 100,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  filterTextLabel: {
    fontSize: 14,
    color: '#fff',
  },
  hideFilterButton: {
    backgroundColor: 'coral',
    height: 20,
    width: 200,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  hideFilterTextLabel: {
    fontSize: 16,
    color: 'white',
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

//need an option for favorites
//need a selector for recent, popular, most voted, most faved
//need to allow selection by tag (check marks?)
//allow for different zoom levels?
