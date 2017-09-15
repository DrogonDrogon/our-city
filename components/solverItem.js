import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import AppStyles from '../styles/AppStyles';

class SolverItem extends React.Component {
  render() {
    return (
      <View style={AppStyles.container}>
        <TouchableHighlight onPress={this.props.goToSolver} style={{ width: 200, height: 200 }}>
          <View>
            <Image style={styles.imageStyle} source={{ uri: this.props.solution.imageUrl }} />
            <Text>{this.props.solution.description}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 0,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
  },
  descriptionText: {
    marginTop: 10,
    width: 200,
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: Image.resizeMode.contain,
    backgroundColor: '#fff',
  },
});

export default SolverItem;
