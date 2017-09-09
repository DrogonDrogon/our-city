import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Share,
  Picker,
} from 'react-native';
import TaggedText from '../../components/TaggedText';
import { Ionicons } from '@expo/vector-icons';
import * as Actions from '../../actions';

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
    picker: '',
    electedOfficailIndex: 0,
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

  share() {
    Share.share({
      title: this.state.phototag.description,
      message: this.state.phototag.description,
      url: this.state.phototag.imageUrl,
    });
  }

  goToElectedOfficials() {
    let phototagData = this.state.phototag;
    this.props.navigation.navigate('electedOfficials', { phototag: phototagData });
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.titleText} />
        <Image
          style={{ width: '100%', height: 200, resizeMode: Image.resizeMode.contain }}
          source={{ uri: this.state.phototag.imageUrl }}
        />
        <TaggedText navigation={this.props.navigation} text={this.state.phototag.description}/>
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
        <TouchableHighlight onPress={this.share.bind(this)}>
          <Ionicons name="md-share-alt" size={32} color="blue" />
        </TouchableHighlight>
        {this.state.phototag.reps && (
          <Button
            title="View government contact info"
            onPress={this.goToElectedOfficials.bind(this)}
          />
        )}
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
