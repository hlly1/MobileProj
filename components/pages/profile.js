import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    TextInput, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Button,
    ActionSheetIOS,
    LayoutAnimation
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { SocialIcon, Image, Text, Input } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from 'react-native-image-picker';
import { resolvePlugin } from "@babel/core";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Login, Signup picture Reference URL:
// https://www.iconfont.cn/illustrations/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=24099

class Profile extends Component{

    constructor(props){
        super(props)
        this.state = {email: "", passwd: "", nickname:"", avatar:[]};
        this.validate = false;
        this.errorMsg = "";
    }

    selectImage = () => {
        // const BUTTONS = ['Take Photo', 'Choose Photo Library', 'Cancel'];
        // ActionSheet.show({options:BUTTONS, cancelButtonIndex: 2, title:'Select a Photo'},
        //     buttonIndex => {
        //         switch (buttonIndex){
        //             case 0:
        //                 break;
        //             case 1:
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // )

        let options = {
            storageOption:{
                path: 'images',
                mediaType: 'photo'
            },
            includeBase64: true
        };

        //开启摄像头，可用
        // launchCamera(options, (response)=>{
        //     console.log('response: ', response);
        //     if (response.didCancel) {
        //         console.log('cancelled image picker');
        //     } else if(response.error){
        //         console.log('imagePicker error: ', response.error);
        //     }else if (response.customButton) {
        //         console.log('imagePicker button tapped: ', response.customButton);
        //     }else{
        //         const source = {uri: 'data:image/jpeg;base64 '+ response.base64};
        //     }
        // });

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
            }
        });
    }

    uploadAvatar = async (uri) =>  {

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
            var registerURL='http://81.68.76.219:80/xxx';
            var registerData = JSON.stringify({
                "email": this.state.email,
                "username": this.state.nickname,
                "password": this.state.passwd,
            });

            const res = await fetch(registerURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: registerData
            }).then(response => response.json())
            .then(responseJson => {
              // Showing response message coming from server after inserting records.
                //alert(JSON.stringify(responseJson));
              if (responseJson["status"] == 1) {
                    var storeData = async (sessionEmail) => {
                        try {
                            await AsyncStorage.setItem('@sessionEmail', sessionEmail);
                        }catch (e) {
                            console.error(e);
                            alert(e);
                        }
                    }
                    storeData(this.state.email);
                    this.navigation.navigate("Home", {});
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


    render(){
        return(
                
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h3 style={styles.profile_title}>Edit My Profile</Text>
                    

                    <View style={styles.profile_card}>
                        <Input placeholder='Email' 
                        onChangeText={text => this.setState({email: text})}/>

                        <Input placeholder="New Password" 
                        secureTextEntry={true} 
                        onChangeText={text => this.setState({passwd: text})}/>

                        <Input placeholder='New Username' 
                        onChangeText={text => this.setState({nickname: text})}/>
    
                        <Button title="Select Avatar" onPress={() => this.selectImage()} />

                        
                        <TouchableOpacity onPress={()=> this.editProfileRequest()} style={{ zIndex: 9999}}>
                            <LinearGradient colors={['#3AA8FE','#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                                <Text style={styles.login_button}>Confirm</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    </ScrollView>
                </LinearGradient>





        )
    }


}
export default Profile;