import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props);

    this.state = {
      fakeData: ['one', 'two', 'three'],
    };
  }

  componentDidMount() {
    console.log('mounted HomeScreen state', this.state, '|| props', this.props);
    this.props.getAllPhototags();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.fakeData.map((item, i) =>
          <Text key={i}>
            {item}
          </Text>
        )}
        <Text>map</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  // Define the function that will be passed as prop
  return {
    getAllPhototags: () => {
      dispatch(Actions.fetchPhototags);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
