import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as Actions from '../../actions';
import PhotoDisplay from '../../components/PhotoDisplay';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isPosting: state.isPosting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: phototag => {
      dispatch(Actions.updatePhototag(phototag));
    },
  };
};

class UserScreen extends React.Component {
  state = {
    description: '',
    phototag: this.props.navigation.state.params,
  };

  setDescription() {
    let tempPhotoTag = this.state.phototag;
    tempPhotoTag.description = this.state.description;
    console.log(this.state.description);
    console.log(tempPhotoTag.description);
    this.setState({ phototag: tempPhotoTag });
    this.setState({ description: '' });
  }

  saveChanges() {
    console.log('changed descriptionText');
    this.props.submitOnePhototag(this.state.phototag);
  }
  render() {
    return (
      <ScrollView>
        <Text style={styles.titleText} />
        <PhotoDisplay phototag={this.state.phototag} />

        <Text style={styles.titleText} />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.description}
          placeholder="Edit description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
        />
        <Button title="submit" onPress={this.setDescription.bind(this)} />
        <Button title="saves changes" onPress={this.saveChanges.bind(this)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
