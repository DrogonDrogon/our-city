import React from 'react';
import { ScrollView, StyleSheet, Text, Button, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as Actions from '../redux/actions';
import PhototagItem from '../components/PhototagItem';

const mapStateToProps = (state, ownProps) => {
  // Passes along any updated state that comes from the reducer into the component's props
  return {
    phototags: state.phototags,
    user: state.user,
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

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const _navigateTo = routeName => {
      const actionToDispatch = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName })],
      });
      navigation.dispatch(actionToDispatch);
    };

    const _logout = () => {
      console.log('click Logout');
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('Sign out successful');
          _navigateTo('Login');
        })
        .catch(error => {
          console.log('Error sign out', error);
        });
    };

    return {
      title: 'Home',
      headerRight: <Button onPress={() => _logout()} title="Logout" />,
    };
  };

  constructor(props) {
    super(props);
    this._navigateTo = this._navigateTo.bind(this);
  }

  componentDidMount() {
    this.props.getAllPhototags();
  }

  _navigateTo(routeName) {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    this.props.navigation.dispatch(actionToDispatch);
  }
  goTopPhototags(item) {
    console.log('clicked!!!!!!!!');
    this.props.navigation.navigate('phototagFromUser', item);
  }
  render() {
    if (this.props.phototags) {
      return (
        <ScrollView>
          <Text style={styles.titleText}>Tagged Photos</Text>
          {this.props.phototags
            .filter(item => item.userName === this.props.user.displayName)
            .map((item, i) => (
              <TouchableHighlight
                style={{ width: '100%', height: 200 }}
                title=""
                key={i}
                onPress={this.goTopPhototags.bind(this, item)}>
                <PhototagItem phototag={item} />
              </TouchableHighlight>
            ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
