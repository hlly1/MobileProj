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
    findNodeHandle
} from 'react-native';
import { styles } from "../../styles/style";
import {Avatar, Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { alignItems, marginTop } from "styled-system";
import {comps} from "../../styles/comp.js";
import ActionButton from 'react-native-action-button';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/Ionicons';
const { height } = Dimensions.get("window");
class postList extends Component{

    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            subject: props.route.params.subject,
            // subject: "COMP90042",
            postlist: [],
            subject_name:"",
            screenHeight: height,
        };
        this.postBody=React.createRef();
        this.setPostHeight = this.setPostHeight.bind(this);
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
            // console.log(responseJson);
            if(responseJson["status"] == 1){
                this.setState({ postlist: responseJson["data"] });
                this.setState({subject_name: responseJson["data"][0]["subject_name"]});
                console.log(responseJson["data"].length * 180 + (responseJson["data"].length-1)*20);
                this.setState({screenHeight: responseJson["data"].length * 180 + (responseJson["data"].length-1)*20});
                if(responseJson["data"].length * 180 + (responseJson["data"].length-1)*20 > height){
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

                        <View style={{marginTop:7,marginBottom:7}}>
                            <Text style={styles.post_title}>{this.state.postlist[i].topic}</Text>
                        </View>
                        
                        <View>
                            <Text style={{marginLeft:7,marginTop:6, textAlign:'right', color:'#7B7B7B', fontSize:12}}>{this.state.postlist[i].post_date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return(
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
                                        
                                {listView}
                                </View>
                        </ScrollView>
                    </View>   
                
                
                <View style={styles.add_post}>
                <Icon
                        reverse
                        name='plus'
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