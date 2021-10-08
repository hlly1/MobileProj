import React, {Component} from "react";
import {View, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity,
    AsyncStorage
} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { Input, Image, Text } from 'react-native-elements';
import Validator from '../tools/validator.js';

//Create and export the component
class Signup extends Component{

    constructor(props) {
        super(props);
        //Mount components
        this.state = {email: '', nickname:'', passwd: '', pin: ''};
        this.navigation = props.navigation;
    }

    async sendRegister(){
        if(this.state.email.length == 0 || this.state.passwd.length == 0){
            this.errorMsg = "Email and Password cannot be empty!";
        }else if(!Validator.email_validate(this.state.email)){
            this.errorMsg = "Invalid Email format!";
        }

        if (Validator.email_validate(this.state.email) && this.state.passwd.length != 0 && this.state.nickname.length != 0){
            this.validate = true;
            this.errorMsg = "";
            // send them to backend
            var registerURL='http://81.68.76.219:80/register';
            var registerData = JSON.stringify({
                "email": this.state.email,
                "username": this.state.nickname,
                "password": this.state.passwd,
                "validation_code": this.state.pin
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

    async sendPinCode(){
        if(this.state.email.length == 0){
            alert("Email cannot be empty!");
        }else if(!Validator.email_validate(this.state.email)){
            alert("Invalid Email format!");
        }

        if (Validator.email_validate(this.state.email)){

            var pincodeURL='http://81.68.76.219:80/sendcode';
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
                alert(JSON.stringify(responseJson));
              if (responseJson["status"] == 1) {
                  alert("Code is sent, please check your email!")
              } else if (resonseJson["status"] == -1) {
                alert("Issue-[xxx]: "+responseJson["errormsg"]+"Please click again!");
              }else{
                alert("Issue-[xxx]: Please contact admin!");
              }
            })
              .catch((error) => {
                alert("Issue-[xxx]:"+error+"Please contact admin!");
              });

        }
    }

    toLogin(){
        this.navigation.navigate('Login', {});
    }

    render = () => {
        return(
                <LinearGradient colors={['#FA8072', '#F08080', '#CD5C5C']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                        <Text h1 style={styles.welcome}>Join us to Start your Fitness!</Text>
                        <View style={styles.image_container}>
                            <Image style={styles.pict2}
                                source={require('../../assets/imgs/signup.png')}
                                PlaceholderContent={<ActivityIndicator />}
                                placeholderStyle={{ backgroundColor: 'transparent' }} />
                        </View>
                        <View style={styles.login_card}>
                            <Input placeholder='Email' 
                            onChangeText={email => this.setState({email: email})} 
                            errorStyle={{ color: 'red' }} 
                            errorMessage={Validator.email_validate(this.state.email)?'':'Invalid Email'}/>

                            <Input placeholder='User Name' 
                            onChangeText={name => this.setState({nickname: name})} 
                            errorStyle={{ color: 'red' }} />

                            <Input placeholder="Password" secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage='' onChangeText={pwd => this.setState({passwd: pwd})}/>
                            
                            <Input placeholder='Pin code' 
                            onChangeText={pincode => this.setState({pin: pincode})} 
                            errorStyle={{ color: 'red' }} />
                            
                            <TouchableOpacity style={styles.options} onPress={() => this.sendPinCode()}>
                                <Text style={styles.forgetPWD}>Send Validation Code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.options} onPress={() => this.toLogin()}>
                                <Text style={styles.forgetPWD}>Already Our Member? Login here.</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.sendRegister()}>
                                <LinearGradient colors={['#FA8072','#CD5C5C']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust}>
                                    <Text style={styles.login_button}>Join Us!</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </LinearGradient>

        )
    }


}

export default Signup