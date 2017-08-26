import React from 'React';
import { View, Text, Image, StyleSheet } from 'react-native';

class PhototagItem extends React.Component {
  render() {
    let imageUri = `data:image/png;base64,${this.props.phototag.imageDataIn64}`;

    return (
      <View style={styles.container}>
        <Image
          style={{ width: 100, height: 100, resizeMode: Image.resizeMode.contain }}
          source={{ uri: imageUri }}
        />
        <Text style={styles.descriptionText}>
          {this.props.phototag.description}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 20,
  },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default PhototagItem;
