import React from 'React';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

class TaggedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: 'Hello #World'};
  }

  goToTagLinkView(tag) {
    // let phototagData = this.state.phototag;
    this.props.navigation.navigate('Map');
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
          <Text onPress={()=> this.goToTagLinkView(text)} key={text} style={styles.hashtag}>
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


