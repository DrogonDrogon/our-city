import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class PhototagItem extends React.Component {
  render() {
    let imageUri = `data:image/png;base64,${this.props.phototag.imageDataIn64}`;

    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.props.goTophototags}
          style={{ width: '100%', height: 200 }}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
            source={{ uri: imageUri }}
          />
        </TouchableHighlight>
        <Text onPress={this.props.goTophototags} style={styles.descriptionText}>
          {this.props.phototag.description}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
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
