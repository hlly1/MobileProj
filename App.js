import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Login from './components/pages/login.js';
import Signup from './components/pages/signup.js';
import MyHome from './components/pages/myhome';
import Profile from './components/pages/profile.js';
import Home from './components/pages/home.js';
import Subjects from './components/pages/majorList.js';
import ForgetPWD from './components/pages/forgetPwd.js';
import MajorList from './components/pages/majorList.js';
import CourseList from './components/pages/courseList.js';
import PostList from './components/pages/postList.js'
import NewPost from './components/pages/newpost.js';
import PostDetails from './components/pages/postdetails.js';
import {Image, NativeBaseProvider } from 'native-base';

import Testpage from './components/pages/postList.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return(
    <Tab.Navigator initialRouteName="" screenOptions={({ route }) => ({
      tabBarIcon: ({focused}) => {
        let iconRoute;
        if (route.name === 'Home') {
          iconRoute = focused
            ? require('./assets/imgs/school-active.png')
            : require('./assets/imgs/school.png');
        } else if (route.name === 'Profile') {
          iconRoute = focused 
            ? require('./assets/imgs/profile-active.png') 
            : require('./assets/imgs/profile.png');
        }else if (route.name === 'Subjects') {
          iconRoute = focused 
            ? require('./assets/imgs/subjects-active.png') 
            : require('./assets/imgs/subjects.png');
        }

        return <NativeBaseProvider>
                <Image size="xs" 
                      source={iconRoute}
                      alt={route.name}/>
              </NativeBaseProvider>;
      },
      headerShown: false,
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
    })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Subjects" component={MajorList} />
      <Tab.Screen name="Profile" component={MyHome} />

      {/* <Tab.Screen name="TestPage" component={Testpage} /> */}
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
          <Stack.Screen name="ProfileTab" component={Profile} />
          <Stack.Screen name="ForgetPWD" component={ForgetPWD} />
          <Stack.Screen name="SubjectList" component={CourseList} />
          <Stack.Screen name="PostList" component={PostList} />
          <Stack.Screen name="NewPost" component={NewPost} />
          <Stack.Screen name="PostDetails" component={PostDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
