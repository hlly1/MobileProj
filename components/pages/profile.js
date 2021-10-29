import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    TextInput, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity,
    ActionSheetIOS,
    LayoutAnimation
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { SocialIcon, Image, Text, Input, Avatar } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from 'react-native-image-picker';
import { resolvePlugin } from "@babel/core";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeBaseProvider, Icon, Button, AddIcon, //Avatar
} from 'native-base';

// Login, Signup picture Reference URL:
// https://www.iconfont.cn/illustrations/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=24099
// Default user avatar: https://www.iconfont.cn/search/index?searchType=icon&q=user
class Profile extends Component{

    constructor(props){
        super(props)
        this.state = { email: "", passwd: "", nickname: "", avatar: ""};
        this.validate = false;
        this.errorMsg = "";
        this.navigation = props.navigation;
    }

    selectImage = () => {
        let options = {
            storageOption:{
                path: 'images',
                mediaType: 'photo'
            },
            includeBase64: true
        };

        //打开图库，可用
        launchImageLibrary(options, (response)=>{
            console.log('response: ', response);
            if (response.didCancel) {
                console.log('cancelled image picker');
            } else if(response.error){
                console.log('imagePicker error: ', response.error);
            }else if (response.customButton) {
                console.log('imagePicker button tapped: ', response.customButton);
            }else{
                const source = {uri: 'data:image/jpeg;base64 '+ response.base64};
                this.setState({avatar: source});
            }
        });
    }

    uploadByCamera = () => {
        let options = {
            storageOption:{
                path: 'images',
                mediaType: 'photo'
            },
            includeBase64: true
        };

        //开启摄像头，可用
        launchCamera(options, (response)=>{
            console.log('response: ', response);
            if (response.didCancel) {
                console.log('cancelled image picker');
            } else if(response.error){
                console.log('imagePicker error: ', response.error);
            }else if (response.customButton) {
                console.log('imagePicker button tapped: ', response.customButton);
            }else{
                const source = {uri: 'data:image/jpeg;base64 '+ response.base64};
                this.setState({avatar: source});
            }
        });
    }

    async editProfileRequest(){
        if(this.state.email.length == 0 || this.state.passwd.length == 0){
            this.errorMsg = "Email and Password cannot be empty!";
        }else if(!Validator.email_validate(this.state.email)){
            this.errorMsg = "Invalid Email format!";
        }

        if (Validator.email_validate(this.state.email) && this.state.passwd.length != 0 && this.state.nickname.length != 0){
            this.validate = true;
            this.errorMsg = "";
            // send them to backend
            var editProileURL='http://81.68.76.219:80/xxx';
            var editProileData = JSON.stringify({
                "email": this.state.email,
                "username": this.state.nickname,
                "password": this.state.passwd,
                "icon_data": this.avatar
            });

            const res = await fetch(editProileURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: editProileData
            }).then(response => response.json())
            .then(responseJson => {
              if (responseJson["status"] == 1) {

                
                alert("Profile Edited Successfully!");
                this.navigation.navigate("Home",{});
              } else if (resonseJson["status"] == -1) {
                alert("Issue-[xxx]: "+responseJson["message"]+"Please check it again!");
              }else{
                alert("Issue-[xxx]: Please contact admin!");
              }
            })
              .catch((error) => {
                alert("Issue-[xxx]:"+error);
              });
        }

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
        this.setState({email: sessionEmail});
        var getUserInfoData = JSON.stringify({
            "email": sessionEmail,
        });
        // console.log("email:" + sessionEmail);
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
                        console.log(this.state.avatar);
                        this.setState({ avatar: 'data:image/jpeg;base64,' + responseJson["icon_data"] + '}' });
                        // this.setState({ avatar: require("../../assets/imgs/user-circle-1.png") });
                        console.log(this.state.avatar);
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

    componentDidMount(){
        this.getUserInfo();
    }


    render(){
        return(
            <NativeBaseProvider>
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h3 style={styles.profile_title}>Edit My Profile</Text>
                    

                    <View style={styles.profile_card}>
                        <Input placeholder={this.state.email}
                        style={{backgroundColor:"#DEDEDE", color: "white", borderRadius:8}}
                        label="Email(Confirmed)"
                        disabled={true}
                        disabledInputStyle={{opacity: 1}}
                        />

                        <Input placeholder="Empty for NO changes" 
                        secureTextEntry={true} 
                        label="New Password(optional)"
                        onChangeText={text => this.setState({passwd: text})}
                        />

                        <Input placeholder='Empty for NO changes' 
                        label="New Username"
                        onChangeText={text => this.setState({nickname: text})}/>
                            
                            {this.state.avatar == '' 
                            ?
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                size="large"
                                source={require("../../assets/imgs/user-circle-1.png")}
                            >
                            </Avatar>
                            :
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                size="large"
                                source={{
                                    uri: this.state.avatar,
                                }}
                            >
                            </Avatar>
                            }

                            <Button leftIcon={<AddIcon size="4" />} onPress={() => this.selectImage()} style={styles.margin_upbottom20}>
                                Upload by Gallery
                            </Button>
                            
                            <Button leftIcon={<AddIcon size="4" />} onPress={() => this.uploadByCamera()} style={styles.margin_bottom20}>
                                Upload by Camera
                            </Button>

                            <Button
                                leftIcon={<Icon name="cog-outline" type="Ionicons" color="white" />}
                                borderRadius={12} colorScheme="success"
                                onPress={()=> this.editProfileRequest()}
                                >
                                Confirm My Updates
                            </Button>   
                        
                        
                    </View>
                    </ScrollView>
                </LinearGradient>
                </NativeBaseProvider>




        )
    }


}
export default Profile;