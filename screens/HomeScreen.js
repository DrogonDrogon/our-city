import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
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

  render() {
    if (this.props.phototags) {
      return (
        <ScrollView>
          <Text style={styles.titleText}>Tagged Photos</Text>
          {this.props.phototags.map((item, i) => <PhototagItem key={i} phototag={item} />)}
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
