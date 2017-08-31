import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class PhototagItem extends React.Component {
  render() {
    let imageUri = `data:image/png;base64,${this.props.phototag.imageDataIn64}`;

    return (
      <View style={styles.container}>
        <Image
          style={{ width: 50, height: 50, marginTop: 5, marginBottom: 5 }}
          source={{
            uri:
              this.props.phototag.photoUrl ||
              'https://upload.wikimedia.org/wikipedia/commons/4/41/NYC_Skyline_Silhouette.png',
          }}
        />
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
    width: '75%',
    height: 300,
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
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
