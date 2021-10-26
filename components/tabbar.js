import React, {Component} from "react";
import 'react-native-gesture-handler';
import {TouchableOpacity, View, Text} from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import Home from './pages/home.js';
import Profile from './pages/profile.js';
// Reference:
// Icons are all from
// https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=35047

class Tabbar extends Component {
    
    render = () => {
       return (
            <View>
                <Button title="Home" />
                <Button title="Profile" onPress={() => this.props.navigate('profile')} />
            </View>
        );
    }
}

export default Tabbar;