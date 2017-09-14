import React from 'react';
import { Modal, View, Text, TextInput, Image } from 'react-native';
import NavigationBar from 'react-native-navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class EditPhototagModal extends React.Component {
  render() {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.props.modalEditVis}
        onRequestClose={() => {}}>
        <NavigationBar
          title={this.props.modalNavTitle}
          rightButton={this.props.modalNavRightButton}
          leftButton={this.props.modalNavLeftButton}
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.photoDisplayContainer}>
            <TextInput
              value={this.props.editedDescription}
              placeholder="Enter description"
              onChangeText={text => this.props.editDescription(text)}
              clearButtonMode={'always'}
              style={styles.descriptionInput}
              multiline
            />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}

const styles = {};

export default EditPhototagModal;
