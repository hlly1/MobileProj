import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    StatusBar,
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text} from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

class Settings extends Component{

    constructor(props){
        super(props)
        this.navigation = props.navigation;
    }

    toEditProfile(){
        this.navigation.navigate('ProfileTab', {});
    }

    async logout(){
        await AsyncStorage.getAllKeys().then(
            keys => AsyncStorage.multiRemove(keys)
        ).then(
            () => this.navigation.navigate("Login", {})
        );
    }

    render(){
        return(
            
                <LinearGradient colors={['#094183', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <Text h3 style={styles.profile_title}>Settings</Text>
                    <View style={styles.profile_card}>
                    {/* <Text h5 style={{color:'grey', fontWeight:'bold', marginBottom: 20}}>SETTING LIST: </Text> */}
                    <Button
                        title="Edit My Profile"
                        raised
                        onPress={() => this.toEditProfile()}
                    />
                    <View style={{height:20}}></View>
                    <Button
                        title="Logout"
                        raised
                        onPress={() => this.logout()}
                        buttonStyle={{backgroundColor:'red'}}
                    />
                        
                    </View>
                </LinearGradient>
        )
    }


}
export default Settings;