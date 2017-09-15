import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment';
import AppStyles from '../styles/AppStyles';

export default class PhotoDisplay extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
          source={{ uri: this.props.phototag.imageUrl }}
        />
        <Text>{this.props.phototag.description}</Text>
        <Text style={styles.authorContainer}>
          <Text>Posted by temp-name-here, {moment(this.props.phototag.timestamp).fromNow()}</Text>
          <Image
            style={styles.imageSetting}
            source={{
              uri:
                this.props.phototag.userProfileUrl ||
                'https://upload.wikimedia.org/wikipedia/commons/4/41/NYC_Skyline_Silhouette.png',
            }}
          />
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
  },
  authorContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
  },
  imageSetting: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderRadius: 20,
  },
});
