import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/pages/login.js';
import Signup from './components/pages/signup.js';
import Home from './components/pages/home.js';
import { Component } from 'react';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {

    return (
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage" headerMode='none'>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
      
    );
  }
}

// export const App = StackNavigator({
//   Home: { screen: HomeScreen },
//   Chat: { screen: ChatScreen },
// });

// export default App;
