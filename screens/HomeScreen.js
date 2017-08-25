import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props);

    this.state = {
      fakeData: [
        {
          id: '1',
          description: 'Test description1',
          user_id: 1,
        },
        {
          id: '2',
          description: 'Test description2',
          user_id: 2,
        },
        {
          id: '3',
          description: 'Test description3',
          user_id: 3,
        },
      ],
    };
  }

  componentDidMount() {
    // console.log('mounted HomeScreen state', this.state, '|| props', this.props);
    this.props.getAllPhototags();
  }

  render() {
    if (this.props.phototags) {
      return (
        <ScrollView style={styles.container}>
          {this.props.phototags.map((item, i) =>
            <Text key={i}>
              {`Id: ${item.id} - UserId: ${item.user_id} - Description: ${item.description}`}
            </Text>
          )}
        </ScrollView>
      );
    } else {
      return(
        <ScrollView>
        </ScrollView>
      )
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
