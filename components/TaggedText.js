import React from 'React';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

class TaggedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: 'Hello #World'};
  }

  tagLink(tag) {
    //needs to navigate to list page
    //needs to set selectedTag to [tag]
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
          <Text key={text} style={styles.hashtag}>
            {text}
          </Text>
        );
      } else {
        return text;
      }
    });

    return (
      <View>
        <Text>{parts}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default TaggedText;


