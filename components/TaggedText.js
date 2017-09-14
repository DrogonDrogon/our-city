import React from 'React';
import { View, Text, StyleSheet } from 'react-native';
import AppStyles from '../styles/AppStyles.js';

class TaggedText extends React.Component {
  goToTagLinkView(tag) {
    // let phototagData = this.state.phototag;
    tag = tag
      .split('')
      .slice(1)
      .join('');
    this.props.navigation.navigate('Map', {
      navFromLink: true,
      isMapToggled: false,
      tags: [tag],
      filters: {
        selectedTags: [tag],
        numResults: 25,
        radius: 50,
        favorites: false,
        sortBy: 'Date',
        FavIsSelected: false,
        user: null,
      },
    });
  }
  render() {
    //define delimiter
    let delimiter = /\s+/;

    //split string
    let _text = this.props.text;
    let token,
      index,
      parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);

    //highlight hashtags
    parts = parts.map(text => {
      if (/^#/.test(text)) {
        return (
          <Text onPress={() => this.goToTagLinkView(text)} key={text} style={AppStyles.hashtag}>
            {text}
          </Text>
        );
      } else {
        return text;
      }
    });

    return (
      <View style={AppStyles.descriptionContainerView}>
        <Text style={AppStyles.descriptionContainerText}>{parts}</Text>
      </View>
    );
  }
}

export default TaggedText;
