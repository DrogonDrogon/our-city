import React from 'react';
import { Platform, View, Text, TouchableHighlight } from 'react-native';
import { Ionicons, MaterialCmmunityIcons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/User/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';
import MapScreen from '../screens/Map/MapScreen';
import SolverList from '../screens/User/SolverList';
import IconBadge from 'react-native-icon-badge';

export default TabNavigator(
  {
    Map: {
      screen: MapScreen,
    },
    Camera: {
      screen: CameraScreen,
    },
    Solutions: {
      screen: SolverList,
    },
    Profile: {
      screen: HomeScreen,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ tintColor, focused }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconBadge
              MainElement={
                <Ionicons
                  name={
                    Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person'
                  }
                  size={28}
                  style={{ marginBottom: -3 }}
                  color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
              }
              BadgeElement={<Text style={{ color: '#FFFFFF' }}>{screenProps.badges}</Text>}
              IconBadgeStyle={{
                width: 15,
                height: 15,
                backgroundColor: '#ff0000',
              }}
              Hidden={screenProps.badges === 0}
            />
          </View>
        ),
      }),
    },
  },
  {
    navigationOptions: ({ navigation, screenProps }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Profile':
            iconName =
              Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person';
            break;
          case 'Solutions':
            iconName = Platform.OS === 'ios' ? `ios-bulb${focused ? '' : '-outline'}` : 'md-bulb';
            break;
          case 'Camera':
            iconName =
              Platform.OS === 'ios' ? `ios-camera${focused ? '' : '-outline'}` : 'md-camera';
            break;
          case 'Map':
            iconName = Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: false,
      style: {
        height: 45,
        backgroundColor: 'black',
      },
    },
    header: null,
  }
);
//possible icons for solutions: bulb, build, cog, construct, hammer, hand, key, medal, ribbon, trophy,
