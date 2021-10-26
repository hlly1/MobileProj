import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';

import Login from './components/pages/login.js';
import Signup from './components/pages/signup.js';
import Home from './components/pages/home.js';
import Profile from './components/pages/profile.js';
import TestFunc from './components/pages/testfunc.js';
import Tabbar from './components/tabbar.js';
import { Drawer } from 'native-base';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

export default class App extends Component {

  render() {

    return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage" headerMode='none'>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="TestFunc" component={TestFunc} />
        </Stack.Navigator>
      </NavigationContainer>
      
    );
  }
}
