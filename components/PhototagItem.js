import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';

class PhototagItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
    padding: 5,
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
