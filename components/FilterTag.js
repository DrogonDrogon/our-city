import React from 'React';
import { View, Text, Image, StyleSheet, Button } from 'react-native';


class FilterTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
      color: "#841584",
    }
  }

  setColor() {
    if (!this.state.pressed) {
      this.setState({
        color: '#000742',
        pressed: !this.state.pressed,
      });
    } else {
      this.setState({
        color: '#841584',
        pressed: !this.state.pressed,
      });
    }
  }

  render(){
    if (this.props.selectedTags.includes(this.props.tag) && !this.state.pressed) {
      this.setColor();
    }
    return(
      <Button
        onPress={(e) => {
          this.setColor();
          this.props.selectTag(this.props.tag);
        }}
        title={this.props.tag}
        color={this.state.color}
        accessibilityLabel="Learn more about this purple button"
      />
    );
  }
}

export default FilterTag;