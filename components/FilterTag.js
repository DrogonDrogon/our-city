import React from 'React';
import { View, Text, Image, StyleSheet, Button } from 'react-native';


class FilterTag extends React.Component {
  

  render(){
    return(
      <Button
        onPress={this.props.title}
        title={this.props.tag}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    );
  }
}

export default FilterTag;