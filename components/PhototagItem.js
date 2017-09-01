import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class PhototagItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 10, height: 10, marginTop: 5, marginBottom: 5 }}
          source={{
            uri:
              this.props.phototag.photoUrl ||
              'https://upload.wikimedia.org/wikipedia/commons/4/41/NYC_Skyline_Silhouette.png',
          }}
        />
        <TouchableHighlight
          onPress={this.props.goToPhototags}
          style={{ width: '100%', height: 200 }}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.props.phototag.imageUrl }}
          />
        </TouchableHighlight>
        <Text onPress={this.props.goToPhototags} style={styles.descriptionText}>
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
    marginTop: 0,
    marginBottom: 5,
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 10,
  },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default PhototagItem;
