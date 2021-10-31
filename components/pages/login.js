import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    TextInput, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { SocialIcon, Image, Text, Input } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import Utils from '../tools/utils.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Login, Signup picture Reference URL:
// https://www.iconfont.cn/illustrations/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=24099

class Login extends Component{

    constructor(props){
        super(props)
        this.state = {email: "", passwd: ""};
        this.validate = false;
        this.errorMsg = "";
        this.navigation = props.navigation;
    }

    checkLogin(){
        AsyncStorage.getItem('sessionEmail')
        .then((item) => {
            console.log("item: "+item);
             if (item) {
               this.toHomePage();
             }
        });
    }

    toHomePage(){
        this.navigation.navigate("HomeTabs", {});
    }

    async login_validation(){
        const useremail = this.state.email;
        const pwd = this.state.passwd;
        
        if(useremail.length == 0 || pwd.length == 0){
            this.errorMsg = "Email and Password cannot be empty!";
        }else if(!Validator.email_validate(useremail)){
            this.errorMsg = "Invalid Email format!";
        }
        
        if (Validator.email_validate(useremail) && !pwd.length == 0){
            this.validate = true;
            this.errorMsg = "";
            // send them to backend
            var loginURL='http://81.68.76.219:80/login';
            var loginData = JSON.stringify({
                "email": useremail,
                "password": pwd
            });
            console.log(loginData);
            const res = await fetch(loginURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: loginData
            }).then(response => response.json())
            .then(responseJson => {
              if (responseJson["status"] == 1) {
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
                    // this.navigation.navigate("Home", {});
                    this.toHomePage();
              } else if (responseJson["status"] == -1) {
                alert("Invalid email and password! Please check it again!");
              } else {
                alert("Database Connection Error!");
              }
            })
              .catch((error) => {
                console.log("login_validation(): "+error);
              });
        }
    }

    goToSignup(){
        this.navigation.navigate('Signup', {});
    }
    
    goToForgetPWD(){
        this.navigation.navigate("ForgetPWD", {});
    }
    
    //回退进入前一页面的时候不好使
    // componentDidUpdate(){
    //     this.checkLogin();
    // }

    render(){

        return(
                
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h1 style={styles.welcome}>Welcome to your University app!{this.checkLogin()}</Text>

                
                    <View style={styles.image_container}>
                        <Image style={styles.pict}
                            source={require('../../assets/imgs/login.png')}
                            PlaceholderContent={<ActivityIndicator />}
                            placeholderStyle={{ backgroundColor: 'transparent' }} />
                    </View>

                    <View style={styles.login_card}>
                        <Input placeholder='Email' 
                        onChangeText={text => this.setState({email: text})}/>

                        <Input placeholder="Password" 
                        secureTextEntry={true} 
                        onChangeText={text => this.setState({passwd: text})}/>

                        <View style={styles.options}>
                            <Text style={styles.forgetPWD} onPress={() => this.goToForgetPWD()}>Forget Password?</Text>
                            <Text style={styles.signup} onPress={() => this.goToSignup()}>Join Us!</Text>
                        </View>

                        <TouchableOpacity onPress={()=> this.login_validation()}>
                            <LinearGradient colors={['#3AA8FE','#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                                <Text style={styles.login_button}>Login!</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <FlashMessage position="center" />
                    </View>
                    </ScrollView>
                </LinearGradient>





        )
    }


}
export default Login;