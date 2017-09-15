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
      <Image
        style={{ height: '100%', width: '100%' }}
        source={require('../../assets/images/manyBulbs.png')}
        resizeMode="cover">
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
          contentContainerStyle={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginTop: 20,
            width: '100%',
          }}
        />
      </Image>
    );
  }
}

export default ListView;
