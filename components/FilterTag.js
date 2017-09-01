import React from 'React';
import { View, Text, Image, StyleSheet, Button } from 'react-native';


class FilterTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
    }
  }

  render(){
    return(
      <Button
        onPress={e => this.setState({pressed: true})}
        title={this.props.tag}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    );
  }
}

export default FilterTag;