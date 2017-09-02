import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import PhotoDisplay from '../../components/PhotoDisplay';
import PhototagItem from '../../components/PhototagItem';
import * as Actions from '../../actions';
import db from '../../db';

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
  state = {
    userFavs: [],
  };

  componentDidMount() {
    // fetch favorites
    let favKeys = Object.keys(this.props.user.favs);
    const favPromises = favKeys.map(id => {
      return db
        .child('phototags')
        .child(id)
        .once('value')
        .then(snapshot => {
          return snapshot.val();
        })
        .catch(err => {
          console.log('err', err);
        });
    });
    // return an array of phototags (userFavs)
    Promise.all(favPromises)
      .then(userFavs => {
        // check to filter out placeholders
        let validEntries = [];
        userFavs.forEach(item => {
          if (item) {
            validEntries.push(item);
          }
        });
        this.setState({ userFavs: validEntries });
      })
      .catch(err => {
        console.log('ERR getting userFavs', err);
      });
  }

  goToPhototags = item => {
    this.props.navigation.navigate('PhototagFromUser', item);
  };

  render() {
    return (
      <View>
        <Text style={styles.titleText}>My Favourites</Text>
        {this.state.userFavs &&
          this.state.userFavs.map(fav => (
            <PhototagItem
              key={fav.id}
              phototag={fav}
              goToPhototags={this.goToPhototags.bind(this, fav)}
            />
          ))}
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
