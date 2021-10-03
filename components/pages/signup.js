import React, {Component} from "react";
import {View, 
    ActivityIndicator, 
    ScrollView,
    StatusBar,
    TouchableOpacity
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
        this.state = {phone: '', passwd: ''};
        this.navigation = props.navigation;
    }

    toLogin(){
        this.navigation.navigate('Login', {});
    }

    render = (props) => {
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

                        <Input placeholder="Password" secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage='' onChangeText={pwd => this.setState({passwd: pwd})}/>

                            <TouchableOpacity style={styles.options} onPress={this.toLogin()}><Text style={styles.forgetPWD}>Already Our Member? Login here.</Text></TouchableOpacity >

                            <LinearGradient colors={['#FA8072','#CD5C5C']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust}>
                                <Text style={styles.login_button}>Join Us!</Text>
                            </LinearGradient>

                            {/* <View style={styles.options}>
                                <SocialIcon title='Sign In With Facebook' type='facebook'/>
                                <SocialIcon title='Sign In With Facebook' type='twitter'/>
                                <SocialIcon title='Sign In With Facebook' type='google'/>
                            </View> */}
                        </View>
                    </ScrollView>
                </LinearGradient>

        )
    }


}

export default Signup