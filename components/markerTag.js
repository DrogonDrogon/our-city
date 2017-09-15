import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import AppStyles from '../styles/AppStyles';

class MarkerTag extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 50, height: 50, marginTop: 10, resizeMode: Image.resizeMode.contain }}
          source={{ uri: this.props.phototag.imageUrl }}
        />
        <Text onPress={this.props.goToPhototags} style={styles.descriptionText}>
          {this.props.phototag.description}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 90,
  },
  descriptionText: {
    fontWeight: 'bold',
  },
});

export default MarkerTag;
