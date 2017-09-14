import React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import db from '../../db';
import PhototagItem from '../../components/PhototagItem';
import AppStyles from '../../styles/AppStyles';

class ListView extends React.Component {
  _keyExtractor = (item, index) => item.id;

  goToPhototags(item) {
    console.log('This listview item = ', item);
    this.props.navigation.navigate('PhototagFromMap', item);
  }

  _onPressItem = id => {
    // this.setState(state => {
    //   const selected =
    // })
  };
  render() {
    return (
      <FlatList
        data={this.props.phototags}
        renderItem={({ item }) => (
          <PhototagItem
            navigation={this.props.navigation}
            phototag={item}
            goToPhototags={this.goToPhototags.bind(this, item)}
          />
        )}
        keyExtractor={this._keyExtractor}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    );
  }
}

export default ListView;
