import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { Text, Input, } from 'react-native-elements';
import Validator from '../tools/validator.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NativeBaseProvider, Icon, Button, AddIcon, //Avatar
} from 'native-base';

// Login, Signup picture Reference URL:
// https://www.iconfont.cn/illustrations/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=24099
// Default user avatar: https://www.iconfont.cn/search/index?searchType=icon&q=user
class ForgetPWD extends Component{

    constructor(props){
        super(props)
        this.state = { email: "", pin: ""};
        this.validate = false;
        this.errorMsg = "";
        this.navigation = props.navigation;
    }

    async sendPinCode(){
        if(this.state.email.length == 0){
            alert("Email cannot be empty!");
        }else if(!Validator.email_validate(this.state.email)){
            alert("Invalid Email format!");
        }else if (this.state.pin.length != 0) {
            alert("PIN Code cannot be zero!");
        }

        if (Validator.email_validate(this.state.email)){

            var pincodeURL='http://81.68.76.219:80/forget/sendcode';
            var pinData = JSON.stringify({
                "email": this.state.email
            });

            const res = await fetch(pincodeURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: pinData
            }).then(response => response.json())
            .then(responseJson => {
              // Showing response message coming from server after inserting records.
                // alert(JSON.stringify(responseJson));
              if (responseJson["status"] == 1) {
                  alert("Code is sent, please check your email!");
              } else if (responseJson["status"] == -1) {
                alert(responseJson["msg"]);
              }else{
                alert("Unexpected Error");
              }
            })
              .catch((error) => {
                alert("Issue:"+error);
              });

        }
    }

    async validate_info(){


        if (this.state.email.length != 0 && this.state.pin.length != 0){

            var pincodeURL='http://81.68.76.219:80/validate/validation_code';
            var pinData = JSON.stringify({
                "email": this.state.email,
                "validation_code": this.state.pin
            });

            const res = await fetch(pincodeURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: pinData
            }).then(response => response.json())
            .then(responseJson => {
              // Showing response message coming from server after inserting records.
                // alert(JSON.stringify(responseJson));
              if (responseJson["status"] == 1) {
                  alert("Validated Successfully!");
                  var storeData = async (sessionEmail) => {
                        try {
                            await AsyncStorage.setItem('sessionEmail', sessionEmail);
                            console.log(sessionEmail);
                        }catch (e) {
                            console.error(e);
                            alert(e);
                        }
                    }
                    storeData(this.state.email);
                  this.navigation.navigate("ProfileTab",{});
              } else{
                alert(responseJson["msg"]);
              }
            })
              .catch((error) => {
                alert("Issue-[xxx]:"+error+"Please contact admin!");
              });

        }else if(this.state.email.length == 0){
            alert("Email cannot be empty!");
        }else if(!Validator.email_validate(this.state.email)){
            alert("Invalid Email format!");
        }else if(this.state.pin.length == 0){
            alert("PIN code cannot be empty!");
        }
    }


    render(){
        return(
            <NativeBaseProvider>
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h3 style={styles.profile_title}>Forget Password</Text>
                    

                    <View style={styles.profile_card}>

                        <Input placeholder="You must be registered" 
                        label="Enter Your Email"
                        onChangeText={text => this.setState({email: text})}
                        />

                        <Input placeholder='Enter Your PIN' 
                        label="Validation Code"
                        onChangeText={text => this.setState({pin: text})}/>
                            
                        <TouchableOpacity style={styles.options} onPress={() => this.sendPinCode()}>
                            <Text style={styles.forgetPWD}>Send Validation Code</Text>
                        </TouchableOpacity>

                        <Button
                            leftIcon={<Icon name="cog-outline" type="Ionicons" color="white" />}
                            borderRadius={12} colorScheme="success"
                            onPress={()=> this.validate_info()}
                            >
                            Verification
                        </Button>
                        
                        
                    </View>
                    </ScrollView>
                </LinearGradient>
                </NativeBaseProvider>




        )
    }


}
export default ForgetPWD;