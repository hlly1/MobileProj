import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './components/pages/login.js';
import Signup from './components/pages/signup.js';
import Home from './components/pages/home.js';
import Profile from './components/pages/profile.js';
import TestFunc from './components/pages/testfunc.js'
import Tabbar from './components/tabbar.js'
import { View } from 'native-base';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return(
    <Tab.Navigator initialRouteName="" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default class App extends Component {    

  render = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="HomeTabs" component={HomeTabs}/>
          <Stack.Screen name="TestFunc" component={TestFunc} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
