import React from 'react';
import { ScrollView, StyleSheet, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  componentDidMount() {
    // console.log('mounted HomeScreen state', this.state, '|| props', this.props);
    // this.props.getAllPhototags();
  }

  render() {
    if (this.props.phototags) {
      let myTestId = this.props.phototags[5].id;
      let myTestPhoto = `data:image/png;base64,${this.props.phototags[5].imageData.base64}`;

      return (
        <ScrollView style={styles.container}>
          <Text>Data from firebase:</Text>
          {this.props.phototags.map((item, i) =>
            <Text key={i}>
              {`Id: ${item.id} - UserId: ${item.user_id} - Description: ${item.description}`}
            </Text>
          )}
          <Text>
            Id test: {myTestId}
          </Text>
          <Image
            style={{ width: 100, height: 100, resizeMode: Image.resizeMode.contain }}
            source={{ uri: myTestPhoto }}
          />
        </ScrollView>
      );
    } else {
      return <ScrollView />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
