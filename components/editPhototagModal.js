import React from 'react';
import { Modal, View, Text, TextInput, Image } from 'react-native';
import NavigationBar from 'react-native-navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppStyles from '../styles/AppStyles';

class EditPhototagModal extends React.Component {
  state = {
    navBarTitle: {
      title: 'Edit Description',
    },
  }

  render() {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.props.modalEditVis}
        onRequestClose={() => {}}>
        <NavigationBar
          title={this.state.navBarTitle}
          rightButton={this.props.modalNavRightButton}
          leftButton={this.props.modalNavLeftButton}
        />
        <KeyboardAwareScrollView contentContainerStyle={AppStyles.modalScrollView}>
          <View style={AppStyles.photoDisplayContainer}>
            <TextInput
              value={this.props.editedDescription}
              placeholder="Enter description"
              onChangeText={text => this.props.editDescription(text)}
              clearButtonMode={'always'}
              style={AppStyles.editInputStyle}
              multiline
            />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}

export default EditPhototagModal;
