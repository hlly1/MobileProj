import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
    TouchableOpacity,
    ActivityIndicator} from "react-native";
import {styles} from "../../styles/style";
import { Text, Avatar, Icon} from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider} from 'native-base';
import {comps} from "../../styles/comp.js";
import { LinearProgress } from 'react-native-elements';

class MyHome extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            username: "", 
            icondata: "", 
            posts:[], 
            subjects:[], 
            favorite_posts:[], 
            saved_posts:[],
            loaded:0,
            post_btn:(<Text style={{marginTop: 20, fontSize:15, fontWeight:'bold'}} onPress={()=>this.getMyFavoritePosts("favorite")}>
            <Icon
                type="font-awesome"
                name="star"
                iconStyle={{fontSize: 15}}
            />
            Show Favorite Posts
        </Text>)
        };
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
                    // console.log(responseJson);
                    this.setState({ loaded: 1 });
                    this.setState({ username: responseJson["username"] });
                    this.setState({ loaded: 1 });
                    if (responseJson["icon_data"]) {
                        // console.log(this.state.icondata);
                        this.setState({ icondata: 'data:image/jpeg;base64,' + responseJson["icon_data"]});
                        // this.setState({ icondata: require("../../assets/imgs/user-circle-1.png") });
                        // console.log(this.state.icondata);
                    }
                    this.setState({ posts: responseJson["post_info"] });
                    this.setState({ saved_posts: responseJson["post_info"] });
                    this.setState({ favorite_posts: responseJson["mark_info"] });
                    console.log("MyHome.js Num of Posts: "+responseJson["post_info"].length)
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

    getMyFavoritePosts(option){
        if(option == "favorite"){
            this.setState({posts: this.state.favorite_posts});
            this.setState({post_btn:(<Text style={{marginTop: 20, fontSize:15, fontWeight:'bold'}} onPress={()=>this.getMyFavoritePosts("mypost")}>
            <Icon
                type="font-awesome"
                name="user"
                iconStyle={{fontSize: 15}}
            />
            Show My Own Posts
        </Text>)})
        }else if (option == "mypost") {
            this.setState({posts: this.state.saved_posts});
            this.setState({post_btn:(<Text style={{marginTop: 20, fontSize:15, fontWeight:'bold'}} onPress={()=>this.getMyFavoritePosts("favorite")}>
            <Icon
                type="font-awesome"
                name="star"
                iconStyle={{fontSize: 15}}
            />
            Show Favorite Posts
        </Text>)})
        }
        
    }

    componentDidMount(){
        this.getUserInfo()
    }

    componentDidUpdate(nextProps){
        if (this.props != nextProps) {
            this.getUserInfo();
            // console.log(2);
        }
    }


    openPost = (postID, subject_code) =>{
        this.navigation.navigate('PostDetails', { id: postID, subject: subject_code});
    }

    openSubj = (subjID, subject_name) =>{
        this.props.navigation.navigate('PostList', {subject: subjID, subject_name:subject_name})
    }


    render(){

        let mySubjs = [];
        for (let j = 0; j < this.state.subjects.length; j++) {
            let des = this.state.subjects[j]["subject_code"]+" "+this.state.subjects[j]["subject_name"];
            mySubjs.push(
                <TouchableOpacity key = {j} onPress = {() => this.openSubj(this.state.subjects[j]["subject_code"], this.state.subjects[j]["subject_name"])}>
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
                let avatar_data = "";
                if (this.state.posts[i].icon_data.length != 0) {
                    avatar_data = {uri: 'data:image/jpeg;base64,' + this.state.posts[i]["icon_data"]};
                }else if(this.state.posts[i].icon_data == ""){
                    avatar_data = require("../../assets/imgs/user-circle-1.png");
                }
                    myPosts.push(
                    <TouchableOpacity key={i} style={comps.post_card} onPress = {() => this.openPost(this.state.posts[i]["book_id"], this.state.posts[i]["subject_code"])}>
                    <View style={styles.post_box_column}>
                        <View style={{alignItems:'center'}}>
                            <Text style={styles.post_title}>{this.state.posts[i]["subject_code"]+"\n"+this.state.posts[i]["subject_name"]}</Text>
                        </View>
                        <View style={styles.post_box_row}>
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                rounded
                                size="small"
                                source={avatar_data}
                            >
                            </Avatar>
                            <Text style={{marginLeft:7,marginTop:6}}>{this.state.posts[i]["username"]}</Text>
                        </View>

                        <View style={{marginTop:7}}>
                            <Text style={styles.post_title}>{this.state.posts[i]["topic"]}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                );
            
        }

        return(
            this.state.loaded == 0 
            ? 
                <View style={{ marginTop: 400 }}>
                    <Text style={{textAlign:'center', fontSize: 15}}>Processing</Text>
                    <ActivityIndicator color="green" size={50} />
                    <LinearProgress color="primary" variant='indeterminate' number='1'/>
                    
                </View>
            : 
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
                    <View style={styles.options}>
                        <Text h5 style={{color:'grey', fontWeight:'bold', marginTop: 20}}>MY POSTS</Text>
                        {this.state.post_btn}
                    </View>
                    {myPosts}
                </ScrollView>
                <View style={styles.add_post}>
                        <Icon
                                reverse
                                name='cog'
                                type='font-awesome'
                                color='#2AA5FF'
                                onPress={() => { this.navigation.navigate('Settings', {})}}
                        />
                </View>
                </NativeBaseProvider>
            </View>
            
        )
    }

}

export default MyHome;