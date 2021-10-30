import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    TextInput, 
    DeviceEventEmitter, 
    ScrollView,
    StatusBar,
    TouchableOpacity} from "react-native";
import {styles} from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { Text, Avatar } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import Tabbar from '../tabbar.js';
import { Overlay } from "react-native-elements/dist/overlay/Overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider, Button, Icon, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
class MyHome extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {username: "", icondata: "", posts:[], subjects:[]};
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
                    console.log(responseJson);
                    this.setState({ username: responseJson["username"] });
                    if (responseJson["icon_data"]) {
                        // console.log(this.state.icondata);
                        this.setState({ icondata: 'data:image/jpeg;base64,' + responseJson["icon_data"]});
                        // this.setState({ icondata: require("../../assets/imgs/user-circle-1.png") });
                        // console.log(this.state.icondata);
                    }
                    this.setState({ posts: responseJson["post_info"] });
                    this.setState({ subjects: responseJson["subscribe_info"] });
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

    toEditProfile(){
        this.navigation.navigate('ProfileTab', {});
    }

    componentDidMount(){
        this.getUserInfo()
    }

    componentDidUpdate(nextProps){
        if (this.props != nextProps) {
            this.getUserInfo();
            console.log(2);
        }
    }

    async logout(){
        await AsyncStorage.getAllKeys().then(
            keys => AsyncStorage.multiRemove(keys)
        ).then(
            () => this.navigation.navigate("Login", {})
        );
    }

    // openPost = (postID) =>{
    //     this.navigation.navigate("Post", {post_id: postID});
    // }

    // openSubj = (subjID) =>{
    //     this.navigation.navigate("Subjects", {subject_id: subjID});
    // }


    render(){

        let mySubjs = [];
        for (let j = 0; j < this.state.subjects.length; j++) {
            let des = this.state.subjects[j]["subject_code"]+" "+this.state.subjects[j]["subject_name"];
            mySubjs.push(
                <TouchableOpacity key = {j} onPress = {() => openSubj(this.state.subjects[i]["subject_code"])}>
                    <View style={styles.margin_bottom20}>
                            <Card
                                title={this.state.subjects["subject_major"]}
                                image={require('../../assets/imgs/unimelb-logo.png')}
                                content={des}
                            />
                    </View>
                </TouchableOpacity>
            )
                
        }

        let myPosts = [];
        for (let i = 0; i < this.state.posts.length; i++) {
            myPosts.push(
                <TouchableOpacity key = {i} onPress = {() => openPost(this.state.posts[i]["book_id"])}>
                <View style={styles.margin_bottom20}>
                    <Box
                        bg='violet.800'
                        p="12"
                        rounded="xl"
                        _text={{
                            fontSize: 'md',
                            fontWeight: 'bold',
                            color: 'warmGray.50',
                            textAlign: 'center',
                        }}
                        >
                            <View style={styles.post_box_column}>
                                <View style={{alignItems:'center'}}>
                                    <Text style={styles.post_title}>{this.state.posts[i]["subject_code"] + " "+this.state.posts[i]["subject_name"]}</Text>
                                </View>
                                <View style={styles.post_box_row}>
                                <Avatar
                                    containerStyle={{ alignSelf: "center" }}
                                    rounded
                                    size="small"
                                    source={{
                                        uri: this.state.icondata,
                                    }}
                                >
                                </Avatar>
                                    <Text style={{color:"white", marginLeft:7,marginTop:5,fontSize:15}}>Me</Text>
                                </View>

                                <View style={{marginTop:7}}>
                                    <Text style={styles.post_title}>{this.state.posts[i]["topic"]}</Text>
                                </View>
                                
                            </View>
                    </Box>
                </View>
                </TouchableOpacity>
                )
        }

        return(
            <View style={styles.home_container}>
                <NativeBaseProvider>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.options}>
                        <View style={{alignItems:'flex-start'}}>
                            <Text style={{color:'grey'}}> {Utils.currentDate()}</Text>
                            <Text h4 style={{ maxWidth: 250, overflow: 'scroll' }}>Hi {this.state.username}. Welcome to your university app!</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            
                        {this.state.icondata == '' 
                            ?
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                rounded
                                size="medium"
                                source={require("../../assets/imgs/user-circle-1.png")}
                            >
                            </Avatar>
                            :
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                rounded
                                size="large"
                                source={{
                                    uri: this.state.icondata,
                                }}
                            >
                            </Avatar>
                            }
                            
                        </View>
                    </View>  
                    <Text h5 style={{color:'grey', fontWeight:'bold'}}>FAVORITE SUBJECTS</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {mySubjs}
                    </ScrollView>
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginTop: 20, marginBottom: 20}}>MY POSTS</Text>

                    <ScrollView vertical={true} showsVerticalScrollIndicator={true}>
                        {myPosts}
                    </ScrollView>

                    <TouchableOpacity onPress={() => this.toEditProfile()} style={{ zIndex: 3 }}>
                        <LinearGradient colors={['#3AA8FE', '#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                            <Text style={styles.login_button}>Edit Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.logout()} style={{ zIndex: 3 }}>
                        <LinearGradient colors={['#FF2222', '#FF9122']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.login_button_adjust} >
                            <Text style={styles.login_button}>Logout</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                </NativeBaseProvider>
            </View>
            
        )
    }

}

export default MyHome;