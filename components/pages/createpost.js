import React, { Component } from "react";
import 'react-native-gesture-handler';
import {
    View,
    TextInput,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Button,
    LayoutAnimation
} from "react-native";
import { styles } from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { SocialIcon, Image, Text, Input } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resolvePlugin } from "@babel/core";
import { flexDirection, marginRight, padding } from "styled-system";

class CreatePost extends Component{
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = props.state;
    }

    render = () => {
        return(
            <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.post_title}>Create Your Post</Text>
                    <View style={styles.post_card}>
                        <Text style={styles.post_header}>Title:</Text>
                        <Input placeholder="Title" onChangeText={text => this.setState({post_title: text})} />
                        <Text style={styles.post_header}>ISBN (optional):</Text>
                        <Input placeholder="ISBN" onChangeText={text => this.setState({ post_isbn: text })} />
                        <Text style={styles.post_header}>Book Name (optional):</Text>
                        <Input placeholder="Book Name" onChangeText={text => this.setState({ post_book_name: text })} />
                        <Text style={styles.post_header}>Description:</Text>
                        <Input placeholder="Description" multiline numberOfLines={10} onChangeText={text => this.setState({ post_description: text })} />
                        <TouchableOpacity onPress={() => this.editProfileRequest()} style={{ zIndex: 9999 }}>
                            <LinearGradient colors={['#3AA8FE', '#72DD00']} 
                            start={{ x: 1, y: 0 }} 
                            end={{ x: 0, y: 0 }} 
                            style={styles.login_button_adjust} >
                                <Text style={styles.login_button}>Submit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    }
}

export default CreatePost;