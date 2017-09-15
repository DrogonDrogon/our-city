import React from 'React';
import { Button } from 'react-native';
import AppStyles from '../styles/AppStyles';


class FilterTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
      color: '#2f95dc',
    }
  }
  componentWillMount(){
    if (this.props.selectedTags.includes(this.props.tag) && !this.state.pressed) {
      this.setColor();
    }
  }
  setColor() {
    if (!this.state.pressed) {
      this.setState({
        color: 'coral',
        pressed: !this.state.pressed,
      });
    } else {
      this.setState({
        color: '#2f95dc',
        pressed: !this.state.pressed,
      });
    }
  }

  render(){
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