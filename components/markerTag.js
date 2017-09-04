import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class MarkerTag extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 50, height: 50, resizeMode: Image.resizeMode.contain }}
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
    // backgroundColor: 'white',
  },
  // descriptionText: {
  //   marginTop: 10,
  //   marginBottom: 20,
  // },
});

export default MarkerTag;
