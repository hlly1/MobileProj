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
    Dimensions,
    UIManager,
    findNodeHandle,
    ActivityIndicator
} from 'react-native';
import { styles } from "../../styles/style";
import {Avatar} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { alignItems, marginTop } from "styled-system";
import {comps} from "../../styles/comp.js";
import ActionButton from 'react-native-action-button';
import { LinearProgress } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

class postList extends Component{

    constructor(props){
        super(props);
        this.navigation = props.navigation;
        try{
            this.state = {
                subject: props.route.params.subject,
                subject_name: props.route.params.subject_name,
                postlist: [],
                filtered: [],
                selected: "",
                screenHeight: height,
                servertime: "",
                loaded:0,
            };
        }
        catch(error){
            this.state = {
                subject: "",
                postlist: [],
                filtered: [],
                selected: "",
                subject_name: "",
                screenHeight: height,
                servertime: "",
                loaded:0,
            };
        }
        this.postBody=React.createRef();
        this.setPostHeight = this.setPostHeight.bind(this);
    }

    getSession = async (element) => {
        try {
            return await AsyncStorage.getItem(element);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getPostListNBySubjectCode(){
        var getPostListURL = 'http://81.68.76.219:80/postlist';
        if(this.state.subject == undefined){
            return alert("Subject Code Error!");
        }

        let sessionEmail = await this.getSession('sessionEmail');
        try {
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch (err) {

        }

        console.log(sessionEmail);

        var subjectCodeData = JSON.stringify({
            "email": sessionEmail,
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
                this.setState({ servertime: responseJson["server_time"] });
                if (responseJson["data"].length != 0) {
                    // console.log(responseJson["data"]);
                    this.setState({ postlist: responseJson["data"] });
                    this.timeIntervalFilter(this.state.postlist, 60, 1000 * 60 * 60 * 24);
                }
                this.setState({ loaded: 1 });
                console.log(responseJson["data"].length * 180 + (responseJson["data"].length-1)*20 + 37);
                this.setState({screenHeight: responseJson["data"].length * 180 + (responseJson["data"].length-1)*20 + 37 });
                
                if(responseJson["data"].length * 180 + (responseJson["data"].length-1)*20 + 37 > height){
                    this.setPostHeight();
                }
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

    timeIntervalFilter(posts, n, timeInterval) {
        // console.log(timeInterval);
        this.setState({ filtered: [] });
        var _filtered = [];

        // var currentDate = new Date();

        var currentdataformat = this.state.servertime.replace(/-/g, "/");
        var currentDate = new Date(currentdataformat);
        
        for (let i = posts.length - 1; i >= 0; i--) {
            var dateformat = posts[i].post_date.replace(/-/g, "/");
            // console.log(dateformat);
            var date = new Date(dateformat);
            console.log(currentDate.getTime() - date.getTime());
            if ((currentDate.getTime() - date.getTime()) < n * timeInterval) {
                _filtered.push(posts[i]);
            }
            else {
                i = -1;
            }
        }
        // console.log(this.state.postlist.length);
        this.setState({ filtered: _filtered });
    }

    async postMarkUpdate(i){
        var id = this.state.filtered[i].id;
        var postMarkUpdateURL = 'http://81.68.76.219:80/unmark';
        if (this.state.filtered[i].is_marked == -1){
            postMarkUpdateURL = 'http://81.68.76.219:80/mark';
        }

        let sessionEmail = await this.getSession('sessionEmail');
        try {
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch (err) {

        }

        var postMarkUpdateData = JSON.stringify({
            "email": sessionEmail,
            "book_id": id,
        });
        console.log(postMarkUpdateData);
        const res = await fetch(postMarkUpdateURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: postMarkUpdateData
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson["status"] == 1) {
                    if(this.state.filtered[i].is_marked == -1){
                        alert("Post Mark Successfully!");
                    }
                    else{
                        alert("Post Unmark Successfully!");
                    }
                    this.navigation.navigate('PostList', {});
                } else if (responseJson["status"] == -1) {
                    alert("Failed to update post mark. Please try later!");
                } else {
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

    setPostHeight (){
        _postBody.setNativeProps({height: this.state.screenHeight});
        console.log("screenHeight: "+this.state.screenHeight)
        
    }

    render(){
        let listView = [];
        for(let i = 0; i < this.state.filtered.length; i++){
            let avatar_data = "";
            if (this.state.filtered[i].icon_data.length != 0) {
                avatar_data = {uri: 'data:image/jpeg;base64,' + this.state.filtered[i].icon_data};
            }else if(this.state.filtered[i].icon_data == ""){
                avatar_data = require("../../assets/imgs/user-circle-1.png");
            }

            listView.push(
                <TouchableOpacity key={i} style={comps.post_card} onPress={() => this.toPostDetails(this.state.filtered[i].id)}>
                    <View style={styles.post_box_column}>
                        <View style={styles.post_box_row}>
                            <Avatar
                                containerStyle={{ alignSelf: "center" }}
                                rounded
                                size="small"
                                source={avatar_data}
                            >
                            </Avatar>
                            <Text style={{ flex: 10, marginLeft:7,marginTop:6}}>{this.state.filtered[i].username}</Text>
                            {this.state.filtered[i].is_marked == '1'
                            ?
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} name="star" color="orange" onPress={() => { this.postMarkUpdate(i) }} />
                                </View>
                            : 
                                <View style={{ flex: 1 }}>
                                    <Icon size={30} name="star" color="grey" onPress={() => { this.postMarkUpdate(i) }} />
                                </View>
                            }
                        </View>
                        <View style={{marginTop:7,marginBottom:7}}>
                            <Text style={styles.post_title}>{this.state.filtered[i].topic}</Text>
                        </View>
                        <View>
                            <Text style={{marginLeft:7,marginTop:6, textAlign:'right', color:'#7B7B7B', fontSize:12}}>{this.state.filtered[i].post_date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return(
            this.state.loaded == 0 
            ? 
                <View style={{ marginTop: 400 }}>
                      <LinearProgress color="primary" />
                    <ActivityIndicator color="green" size={50} />
                    <Text style={{textAlign:'center'}}>Loading</Text>
                </View>
            : 
            <LinearGradient colors={['#094183', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                {/* <ScrollView showsVerticalScrollIndicator={false}  > */}
                    <Text h3 style={styles.profile_title}>{this.state.subject+"\n"+this.state.subject_name}</Text>
                    
                    <View style={styles.postlist_card}>
                        <ScrollView style={{overflow:'scroll'}} showsVerticalScrollIndicator={false}>
                            <View ref={compoent => _postBody = compoent}>
                                <Avatar
                                    containerStyle={{ alignSelf: "center" }}
                                    rounded
                                    size="large"
                                    source={require("../../assets/imgs/unimelb-logo.png")}
                                >
                                </Avatar>
                                <View style={{height: 30 }}>
                                    <Picker
                                        mode="dialog"
                                        selectedValue={this.state.selected}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.timeIntervalFilter(this.state.postlist, parseInt(itemValue), 1000 * 60 * 60 * 24);
                                            this.setState({ selected: itemValue });
                                        }
                                        }>
                                        <Picker.Item label="Recent 60 days" value="60" />
                                        <Picker.Item label="Recent 30 days" value="30" />
                                        <Picker.Item label="Recent 7 days" value="7" />
                                        <Picker.Item label="Yesterday" value="1" />
                                    </Picker>
                                </View>
                                {listView.length != 0 ? listView:<Text style={styles.postlist_empty}>Feel free to start your first discussion</Text>}
                            </View>
                        </ScrollView>
                    </View>
                <View style={styles.add_post}>
                    <Icon
                        size={60}
                        name='plus-circle'
                        type='font-awesome'
                        color='#2AA5FF'
                        onPress={() => { this.navigation.navigate('NewPost', { subject: this.state.subject })}}
                    />
                </View>
            </LinearGradient>
        );
    }
}

export default postList;