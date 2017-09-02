import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import PhotoDisplay from '../../components/PhotoDisplay';
import PhototagItem from '../../components/PhototagItem';
import * as Actions from '../../actions';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: user => {
      dispatch(Actions.updateUser(user));
    },
  };
};

class Favourites extends React.Component {
  goToPhototags = item => {
    this.props.navigation.navigate('PhototagFromUser', item);
  };
  render() {
    return (
      <View>
        <Text style={styles.titleText}>My Favourites</Text>
      </View>
    );
  }
}
/*
{Object.entries(this.props.favs).map(fav => (
          <PhototagItem
            key={fav[0]}
            phototag={fav[1]}
            goToPhototags={this.goToPhototags.bind(this, fav)}
          />
        ))}
*/
const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
