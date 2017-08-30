import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class MarkerTag extends React.Component {
  render() {
    let imageUri = `data:image/png;base64,${this.props.phototag.imageDataIn64}`;

    return (
      <View style={styles.container}>
        <Image
          style={{ width: 50, height: 50, resizeMode: Image.resizeMode.contain }}
          source={{ uri: imageUri }}
        />
        <Text onPress={this.props.goTophototags} style={styles.descriptionText}>
          {this.props.phototag.description}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  // descriptionText: {
  //   marginTop: 10,
  //   marginBottom: 20,
  // },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default MarkerTag;
