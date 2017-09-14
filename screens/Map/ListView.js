import React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import db from '../../db';
import PhototagItem from '../../components/PhototagItem';
import AppStyles from '../../styles/AppStyles';

const remote = 'https://s15.postimg.org/tw2qkvmcb/400px.png';

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
    const resizeMode = 'center';

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#eee',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode,
            }}
            source={{ uri: remote }}
          />
        </View>
        <FlatList
          data={this.props.phototags}
          renderItem={({ item }) => <PhototagItem navigation={this.props.navigation} phototag={item} goToPhototags={this.goToPhototags.bind(this, item)}/>}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>  
    );
  }
}

export default ListView;
