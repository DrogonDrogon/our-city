import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import PhototagItem from '../../components/PhototagItem';
import * as Actions from '../../actions';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    userFavs: state.userFavs,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: user => {
      dispatch(Actions.updateUser(user));
    },
    getUserFavorites: user => {
      dispatch(Actions.fetchFavoritesByUser(user));
    },
  };
};

class Favourites extends React.Component {
  componentDidMount() {
    this.props.getUserFavorites(this.props.user);
  }

  goToPhototagsDetail = item => {
    this.props.navigation.navigate('PhototagFromMap', item);
  };

  render() {
    return (
      <View>
        <Text style={styles.titleText}>My Favourites</Text>
        {this.props.userFavs &&
          this.props.userFavs.map(fav => (
            <PhototagItem
              key={`${fav.id}f`}
              phototag={fav}
              goToPhototags={this.goToPhototagsDetail.bind(this, fav)}
              navigation={this.props.navigation}
              badges={fav.badges}
              deleteBadges={this.props.deleteBadges}
              decreaseBadges={this.props.decreaseBadges}
            />
          ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
