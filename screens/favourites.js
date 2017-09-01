import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ListView,
  TouchableHighlight,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import PhototDisplay from '../../components/PhotoDisplay';
import PhototagItem from '../../components/PhototagItem';
import Comment from '../../components/comment';
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
    this.props.navigation.navigate('phototagFromUser', item);
  };
  render() {
    return (
      <ScrollView>
        {Object.entries(this.props.favs).map(fav => (
          <PhototagItem
            key={fav[0]}
            phototag={fav[1]}
            goToPhototags={this.goToPhototags.bind(this, fav)}
          />
        ))}
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
