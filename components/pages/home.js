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
import { Text } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import Tabbar from '../tabbar.js';
import { Overlay } from "react-native-elements/dist/overlay/Overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NativeBaseProvider, Avatar} from 'native-base';

class Home extends Component{

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {username: "", icondata: ""}
    }

    getSessionEmail = async () => {
        try {
            return await AsyncStorage.getItem('sessionEmail');
        }catch (err) {
            console.error(err);
            return null;
        }
    }

    async getUserInfo() {
        var getUserInfoURL = 'http://81.68.76.219:80/get_info_by_email';
        let sessionEmail = await this.getSessionEmail();
        try{
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch(err){

        }
        var getUserInfoData = JSON.stringify({
            "email": sessionEmail,
        });
        console.log("email:" + sessionEmail);
        const res = await fetch(getUserInfoURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: getUserInfoData
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson["status"] == 1) {
                    this.setState({ username: responseJson["username"] });
                    if (responseJson["icon_data"]) {
                        this.setState({icondata:responseJson["icon_data"]});
                    }
                    // return responseJson;
                } else if (responseJson["status"] == -1) {
                    alert("Failed to load user infomation");
                } else {
                    alert("Issue-[xxx]: Please contact admin!");
                }
            })
            .catch((error) => {
                alert("Issue-[xxx]:" + error + "| " + sessionEmail);
            });
    }

    toEditProfile(){
        this.navigation.navigate('Profile', {});
    }

    componentDidMount(){
        this.getUserInfo();
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
            <View style={styles.home_container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.options}>
                        <View style={{alignItems:'flex-start'}}>
                            <Text style={{color:'grey'}}> {Utils.currentDate()} </Text>
                            <Text h4 style={{ maxWidth: 250, overflow: 'scroll' }}>Hi {this.state.username}. Welcome to your university app!</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <NativeBaseProvider>
                                    {this.avatar == '' ?<Avatar
                                    alignSelf="center"
                                    size="lg"
                                    style={styles.margin_bottom20}
                                    source={{
                                        uri: "../../assets/user-circle.png",
                                    }}
                                >
                                </Avatar>:<Avatar
                                    alignSelf="center"
                                    size="lg"
                                    style={styles.margin_bottom20}
                                    source={{
                                        uri: this.icondata,
                                    }}
                                >
                                </Avatar>
                                
                                }
                            </NativeBaseProvider>
                        </View>
                    </View>  
                    <Text h5 style={{color:'grey', fontWeight:'bold'}}>FAVORITE SUBJECTS</Text>
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
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginTop: 20}}>MY POSTS</Text>
                    <TouchableOpacity onPress={() => this.toEditProfile()} style={{ zIndex: 9999 }}>
                        <LinearGradient colors={['#3AA8FE', '#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                            <Text style={styles.login_button}>Edit Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()} style={{ zIndex: 3 }}>
                        <LinearGradient colors={['#3AA8FE', '#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                            <Text style={styles.login_button}>Logout</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                {/* <Tabbar /> */}
            </View>
        )
    }

}
export default Home;