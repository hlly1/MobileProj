import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/pages/login.js';
import Signup from './components/pages/signup.js';
import Home from './components/pages/home.js';
import Profile from './components/pages/profile.js';
import { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default class App extends Component {

  render() {

    return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage" headerMode='none'>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>

        {/* <Tab.Navigator>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator> */}

      </NavigationContainer>
      
    );
  }
}
