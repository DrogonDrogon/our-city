import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Expo, { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import * as firebase from 'firebase';
import config from './config/config.js';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import reducer from './redux/reducer';
import * as Actions from './redux/actions';

// Create the redux store
const initialState = {};
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(loggerMiddleware, thunkMiddleware)
);

// Initialize Firebase
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
};

firebase.initializeApp(firebaseConfig);

async function loginWithFacebook() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    config.facebook.API_KEY,
    { permissions: ['public_profile'] }
  );

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    console.log('GOT TOKEN', token);
    // Sign in with credential from the Facebook user.
    firebase.auth().signInWithCredential(credential).catch(error => {
      // Handle Errors here.
      console.log('ERROR', error);
    });
  }
}

class App extends React.Component {
  state = {
    assetsAreLoaded: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  componentDidMount() {
    console.log('[didMount] this.props are', this.props);
    // POSTING TO users
    // firebase.database().ref('users/' + 'user4').set({
    //   test: 'asdf'
    // });
    // GETTING users out of (this is on && constantly listens for updates)
    // var usersRef = firebase.database().ref('/users');
    // usersRef.on('value', (snapshot) => {
    //   console.log('snapshot of users table is', snapshot);
    // });
    // GETTING Users out (this only runs once)
    // return firebase.database().ref('/users/').once('value').then((snapshot) => {
    //   console.log('one-time snapshot', snapshot);
    // });
    // loginWithFacebook();
  }

  getPhototags() {
    return firebase.database().ref('/phototags/').once('value').then(snapshot => {
      console.log('one-time snapshot of users', snapshot);
    });
  }

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen) {
      return <AppLoading />;
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
            <RootNavigation />
          </View>
        </Provider>
      );
    }
  }

  async _loadAssetsAsync() {
    try {
      await Promise.all([
        Asset.loadAsync([
          require('./assets/images/robot-dev.png'),
          require('./assets/images/robot-prod.png'),
        ]),
        Font.loadAsync([
          // This is the font that we are using for our tab bar
          Ionicons.font,
          // We include SpaceMono because we use it in HomeScreen.js. Feel free
          // to remove this if you are not using it in your app
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ]),
      ]);
    } catch (e) {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e);
    } finally {
      this.setState({ assetsAreLoaded: true });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  // Define the function that will be passed as prop
  return {
    getPhototags: () => {
      dispatch(Actions.fetchPhototags);
    }
  };
};
export default App;
// export default connect(store, mapStateToProps, mapDispatchToProps)(App);
