import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Button,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { styles } from "../../styles/style";
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { alignItems, marginTop } from "styled-system";
import {comps} from "../../styles/comp.js";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

class postList extends Component{

    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            subject: props.route.params.subject,
            // subject: "COMP90042",
            postlist: [],
            subject_name:""
        }
    }

    async getPostListNBySubjectCode(){
        var getPostListURL = 'http://81.68.76.219:80/postlist';
        if(this.state.subject == undefined){
            return alert("Subject Code Error!");
        }

        var subjectCodeData = JSON.stringify({
            "subject_code": this.state.subject,
        });
        console.log(this.state.subject);
        console.log(subjectCodeData);
        const res = await fetch(getPostListURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: subjectCodeData
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            if(responseJson["status"] == 1){
                this.setState({ postlist: responseJson["data"] });
                this.setState({subject_name: responseJson["data"][0]["subject_name"]})
            }
            else if(responseJson["status"] == -1){
                alert("Failed to submit. Please try later!");
            }else{
                alert("Issue-[xxx]: Please contact admin!");
            }
        })
        .catch((error) => {
            alert("Issue-[xxx]:" + error);
        });
    }

    toPostDetails(id){
        console.log(id);
        this.navigation.navigate('PostDetails', { id: id, subject: this.state.subject });
    }

    componentDidMount(){
        
        if(this.state.subject == ''){
            this.setState({ subject: "COMP90042"});
        }
        this.getPostListNBySubjectCode();
    }

    componentDidUpdate(nextProps){
        if(nextProps != this.props){
            this.getPostListNBySubjectCode();
        }
    }

    render(){
        let listView = [];
        for(let i = 0; i < this.state.postlist.length; i++){
            listView.push(
                <TouchableOpacity key={i} style={comps.post_card} onPress={() => this.toPostDetails(this.state.postlist[i].id)}>
                    <View style={styles.post_box_column}>
                        <View style={styles.post_box_row}>
                        <Avatar
                            containerStyle={{ alignSelf: "center" }}
                            size="small"
                            source={require("../../assets/imgs/user-circle-1.png")}
                        >
                        </Avatar>
                            <Text style={{marginLeft:7,marginTop:6}}>Username</Text>
                        </View>

                        <View style={{marginTop:7}}>
                            <Text style={styles.post_title}>{this.state.postlist[i].topic}</Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>
            );
        }

        return(
            <LinearGradient colors={['#094183', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text h3 style={styles.profile_title}>{this.state.subject+"\n"+this.state.subject_name}</Text>
                    <View style={styles.postlist_card}>
                        <Avatar
                            containerStyle={{ alignSelf: "center" }}
                            rounded
                            size="large"
                            source={require("../../assets/imgs/unimelb-logo.png")}
                        >
                        </Avatar>
                                 
                        {listView}
                    </View>
                    
                </ScrollView>

                {/* 二选一 */}
                {/* <ActionButton
                    buttonColor="#094183"
                    onPress={() => {this.navigation.navigate('NewPost', { subject: this.state.subject })}}
                    size={60}
                /> */}

                <TouchableOpacity style={{ position: "absolute", alignSelf: "center", bottom: 0 }} onPress={() => { this.navigation.navigate('NewPost', { subject: this.state.subject }) }} >
                    <LinearGradient colors={['#3AA8FE', '#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                        <Text style={styles.login_button}>Create New Post</Text>
                    </LinearGradient>
                </TouchableOpacity>
            
            </LinearGradient>
        );
    }
}

export default postList;