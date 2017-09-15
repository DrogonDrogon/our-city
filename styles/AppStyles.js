import { StyleSheet, Image } from 'react-native';

//GLOBAL COLORS
const dark = '#eee';
//-----------

const AppStyles = StyleSheet.create({
  splash: {
    height: '100%',
    width: '100%',
  },
  scrollViewContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 50,
    backgroundColor: 'transparent',
    // backgroundColor: '#FBF8F5', // light bg color
  },
  titleText: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
  },
  commentInput: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
  },
  photoDisplayContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  phototagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  descriptionContainerView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  descriptionContainerText: {
    fontSize: 18,
    color: 'white',
  },
  authorContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
    width: '95%',
  },
  authorNameText: {
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
  },
  imageSetting: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderRadius: 20,
  },

  iconStyle: {
    backgroundColor: '#FBF8F5',
  },
  descriptionInput: {
    width: '95%',
    backgroundColor: '#fff',
    padding: 10,
  },
  horizontalDisplay: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalDisplayNoSpace: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentView: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 16,
    marginRight: 10,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 12,
    marginRight: 10,
    color: 'white',
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  touchableDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageBackground: {
    flex: 1,
  },

  //GLOBAL STYLES
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 0,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    width: '80%',
  },
  descriptionText: {
    marginTop: 10,
    width: 200,
  },
  imageStyle: {
    flex: 1,
    width: 70,
    height: 70,
    resizeMode: Image.resizeMode.cover,
    backgroundColor: 'transparent',
    borderRadius: 35,
  },
  iconBadgeStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#ff0000',
  },
  iconBadgeMain: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 25,
  },
  imageHolder: {
    height: 350,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  hashtag: {
    color: '#63B8FF',
    fontWeight: 'bold',
  },

  // view solution list styles
  solutionTextTitle: {
    fontSize: 18,
  },
  solutionText: {
    fontSize: 14,
  },
  solutionTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  solutionMarkedAsBest: {
    fontSize: 18,
    color: 'green',
  },

  // button styles
  buttonWhiteText: {
    fontSize: 16,
    color: '#FFF',
  },
  actionButton: {
    backgroundColor: 'red',
    height: 20,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  editButton: {
    borderColor: '#2f95dc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
    height: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonBlueText: {
    fontSize: 16,
    color: '#2f95dc',
  },

  // segmented control styling
  mapsTabsContainerStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200,
    backgroundColor: 'transparent',
  },
  mapsTabStyle: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: '#2f95dc',
    height: 28,
  },
  tabStyle: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: '#2f95dc',
    height: 28,
  },
  tabTextStyle: {
    color: '#2f95dc',
  },
  activeTabStyle: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  activeTabTextStyle: {
    color: '#fff',
  },
  profileTabsContainerStyle: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  // Filter Screen styles
  filterCategorySection: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterPicker: {
    width: '95%',
    height: 100,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    marginTop: 10,
  },
  filterPickerItem: {
    height: 100,
    color: 'black',
    fontSize: 16,
  },

  // create/edit solution styles
  whiteText: {
    marginTop: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
    color: 'white',
  },
  whiteTextTitle: {
    marginTop: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 16,
  },
  writeDescriptionInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 10,
    color: 'white',
  },

// edit modal style
  editInputStyle: {
    padding: 10,
    fontSize: 16,
  },
  modalScrollView: {
    backgroundColor: 'white',
    width: '100%',
    paddingBottom: 50,
  }
});

export default AppStyles;
