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
import { SocialIcon, Image, Text, Input } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

class Login extends Component{
    state = {email: "", passwd: ""};
    validate = false;
    errorMsg = "";

    login_validation(){
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
            //  ......
        }else{
            alert(this.errorMsg)
            // return(
            //     showMessage({ 
            //         message: "Oops!",
            //         description: this.errorMsg,
            //         type: "danger",
            //     })
            // )
        }
    }

    signup(){
        // window.location.href('signup.js');
        // this.props.navigation.navigate('Signup')
    }

    render(){

        return(
                
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h1 style={styles.welcome}>Welcome to your execrise app!</Text>

                
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
                            <Text style={styles.forgetPWD}>Forget Password?</Text>
                            <Text style={styles.signup} onPress={this.signup}>Join Us to Be Healthy</Text>
                        </View>

                        <TouchableOpacity onPress={()=> this.login_validation()}>
                            <LinearGradient colors={['#3AA8FE','#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                                <Text style={styles.login_button}>Fit for Life!</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <FlashMessage position="center" />
                        <View style={styles.options}>
                            <SocialIcon title='Sign In With Facebook' type='facebook'/>
                            <SocialIcon title='Sign In With Facebook' type='twitter'/>
                            <SocialIcon title='Sign In With Facebook' type='google'/>
                        </View>
                    </View>
                    </ScrollView>
                </LinearGradient>





        )
    }


}
export default Login;