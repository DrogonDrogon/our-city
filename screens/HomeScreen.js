import React from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as Actions from '../redux/actions';
import PhototagItem from '../components/PhototagItem';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  componentDidMount() {
    // console.log('mounted HomeScreen state', this.state, '|| props', this.props);
    this.props.getAllPhototags();
  }

  _logout() {
    console.log('click Logout');
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Sign out successful');
        this.props.navigation.goBack(0);
      })
      .catch(error => {
        console.log('Error sign out', error);
      });
  }

  render() {
    if (this.props.phototags) {
      return (
        <ScrollView>
          <Text style={styles.titleText}>Tagged Photos</Text>
          {this.props.phototags.map((item, i) => <PhototagItem key={i} phototag={item} />)}
          <Button onPress={this._logout.bind(this)} title="Logout" />
        </ScrollView>
      );
    } else {
      return <ScrollView />;
    }
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

const mapStateToProps = (state, ownProps) => {
  // Passes along any updated state that comes from the reducer into the component's props
  return {
    phototags: state.phototags,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // Define the function that will be passed as prop
  return {
    getAllPhototags: () => {
      dispatch(Actions.fetchPhototags);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
