import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/login.js';
import Signup from './pages/signup.js';
import Home from './pages/home.js';
import { Component } from 'react';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// export default class App extends Component {
//   render() {
//     createHomeStack = () =>
//       <Stack.Navigator initialRouteName="Login" headerMode='none'>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Signup" component={Signup} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>

//     return (
//       <NavigationContainer>

//       </NavigationContainer>
//     );
//   }
// }

export const App = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});

export default App;
