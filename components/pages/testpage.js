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
import LinearGradient from 'react-native-linear-gradient';
import { alignItems } from "styled-system";

class Testpage extends Component{

    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            // subject: props.route.params.subject,
            subject: "COMP90042",
            postlist: [],
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
        // console.log(id);
        this.navigation.navigate('PostDetails', { id: id, subject: this.state.subject });
    }

    componentDidMount(){
        if(this.state.subject == ''){
            this.setState({ subject: "COMP90042" });
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
                <View key={i} style={{ marginTop: 10, marginLeft: 10, marginRight: 10, borderWidth: 1 }}>
                    <Button key={i} title={this.state.postlist[i].topic} color="#000000" onPress={() => this.toPostDetails(this.state.postlist[i].id)} />
                    <Text>{this.state.postlist[i].post_date}</Text>
                </View>
            );
        }

        return(
            <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{height: 50}}>

                    </View>
                    {listView}
                </ScrollView>
                <TouchableOpacity style={{ position: "absolute", alignSelf: "center", bottom: 0 }} onPress={() => { this.navigation.navigate('NewPost', { subject: this.state.subject }) }} >
                    <LinearGradient colors={['#3AA8FE', '#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                        <Text style={styles.login_button}>Create New Post</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
}

export default Testpage;