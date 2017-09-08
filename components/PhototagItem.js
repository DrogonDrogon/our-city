import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import TaggedText from './TaggedText';

class PhototagItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.props.goToPhototags}
          style={{ width: '100%', height: 200 }}>
          <Image style={styles.imageStyle} source={{ uri: this.props.phototag.imageUrl }} />
        </TouchableHighlight>
        <TaggedText text={this.props.phototag.description}/>
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
  },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default PhototagItem;
