import React from 'React';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import TaggedText from './TaggedText';
import IconBadge from 'react-native-icon-badge';
import AppStyles from '../styles/AppStyles';

class PhototagItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignSelf: 'flex-end',
            marginTop: -5,
            position: 'absolute',
          }}>
          <IconBadge
            MainElement={
              <View
                style={{
                  backgroundColor: '#fff',
                  width: 50,
                  height: 50,
                  margin: 6,
                }}
              />
            }
            BadgeElement={<Text style={{ color: '#000' }}>{this.props.badges}</Text>}
            IconBadgeStyle={{
              width: 30,
              height: 30,
              backgroundColor: '#ff0000',
            }}
            Hidden={this.props.badges === 0}
          />
        </View>
        <TouchableHighlight
          onPress={() => {
            this.props.decreaseBadges(this.props.phototag.badges);
            this.props.deleteBadges(this.props.phototag);
            this.props.goToPhototags();
          }}
          style={{ width: '100%', height: 200 }}>
          <Image style={styles.imageStyle} source={{ uri: this.props.phototag.imageUrl }} />
        </TouchableHighlight>
        <TaggedText navigation={this.props.navigation} text={this.props.phototag.description} />
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
    width: '80%',
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
    backgroundColor: '#fff',
  },
});

// <Text>
// Location: {this.props.phototag.locationLat}, {this.props.phototag.locationLong}
// </Text>
export default PhototagItem;
