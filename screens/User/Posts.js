import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import PhototagItem from '../../components/PhototagItem';
import AppStyles from '../../styles/AppStyles';

class Posts extends React.Component {
  componentWillUpdate() {
    // console.log('posts updated', this.props);
  }
  componentDidMount() {}

  render() {
    return (
      <View>
        <Text style={AppStyles.titleText}>My Posts</Text>
        {this.props.phototags &&
          this.props.phototags
            .filter(item => item.userId === this.props.user.id)
            .map((item, i) => (
              <PhototagItem
                phototag={item}
                key={item.id}
                goToPhototags={this.props.goToPhototags.bind(this, item)}
                navigation={this.props.navigation}
                badges={item.badges}
                deleteBadges={this.props.deleteBadges}
                decreaseBadges={this.props.decreaseBadges}
              />
            ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
});

export default Posts;
