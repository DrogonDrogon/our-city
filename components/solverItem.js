import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class solverItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.props.goToSolver} style={{ width: '100%', height: 200 }}>
          <View>
            <Image style={styles.imageStyle} source={{ uri: this.props.phototag.imageUrl }} />
            <Text>
              {this.props.phototag.description}
            </Text>
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
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: Image.resizeMode.contain,
    backgroundColor: '#fff',
  },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default solverItem;