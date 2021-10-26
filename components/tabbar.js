import React, {Component} from "react";
import 'react-native-gesture-handler';
import { 
    View, 
    Button,
    Image, 
    Text, 
    TouchableOpacity} from 'react-native';
import { styles } from "../styles/style.js";

// import { useNavigation } from '@react-navigation/native';
// import { BottomNavigation } from 'react-native-paper';

import Login from './pages/login.js'
import Home from './pages/home.js';
import Profile from './pages/profile.js';

// Reference:
// Icons are all from
// https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=35047
class Tabbar extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
    }

    test(){
        if(this.navigation == null){
            
        }
        // this.navigation.navigate("Profile", {});
    }

    render = () => {
        return (
            <View>
                <Button title="Home" />
                <Button title="Profile" onPress={() => {}} />
            </View>
        );
    }
    
}

export default Tabbar;