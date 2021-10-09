import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    TextInput, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { Text, Avatar } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import Tabbar from '../tabbar.js';
import { Overlay } from "react-native-elements/dist/overlay/Overlay";

class Home extends Component{

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    toEditProfile(){
        this.navigation.navigate('Profile', {});
    }

    render(){

        return(
            <View style={styles.home_container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.options}>
                        <View style={{alignItems:'flex-start'}}>
                            <Text style={{color:'grey'}}> {Utils.currentDate()} </Text>
                            <Text h4 style={{maxWidth: 250, overflow:'scroll'}}>Welcome to your fitness app!</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <Avatar
                                rounded
                                source={{
                                    uri:
                                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&usqp=CAU',
                                }}
                                size={55}  
                            />
                        </View>
                    </View>  
                    <Text h5 style={{color:'grey', fontWeight:'bold'}}>DAILY TASKS</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <Card
                            title={'Running'}
                            image={require('../../assets/imgs/card_back.jpg')}
                            content={'descriptions'}
                        />
                        <Card
                            title={'Running'}
                            image={require('../../assets/imgs/card_back.jpg')}
                            content={'descriptions'}
                        />
                        <Card
                            title={'Running'}
                            image={require('../../assets/imgs/card_back.jpg')}
                            content={'descriptions'}
                        />
                        <Card
                            title={'Running'}
                            image={require('../../assets/imgs/card_back.jpg')}
                            content={'descriptions'}
                        />
                    </ScrollView>
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginTop: 20}}>WORKOUT SUMMARY</Text>
                </ScrollView>

                <TouchableOpacity onPress={()=> this.toEditProfile()}  style={{ zIndex: 3}}>
                    <LinearGradient colors={['#3AA8FE','#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                        <Text style={styles.login_button}>Edit Profile</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* <Tabbar /> */}
            </View>
        )
    }

}
export default Home;