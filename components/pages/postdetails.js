import React, { Component } from 'react';
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
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from 'react-native-linear-gradient';
import {styles} from "../../styles/style";
import {NativeBaseProvider} from 'native-base';
import { FAB} from 'react-native-elements';
import { Rating, AirbnbRating,LinearProgress  } from 'react-native-elements';

const API_KEY = "AIzaSyA3E-GOaYiksOZjDcbNQe-l-ZC_yviS-Rg";

class postDetails extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            id: props.route.params.id,
            topic: "",
            subject: props.route.params.subject,
            ISBN: "",
            bookname: "",
            description: "",
            imageList: [],
            // image: "",
            location: "",
            location_name: "",
            postdate: "",
            markcount: "",
            commentList: [],
            comment: "",

            hasPermission: undefined,
            audioPath: AudioUtils.DocumentDirectoryPath + '/Audio' + props.route.params.id + '.acc',
            audio_base64: "",

            loaded: 0,
        };
        this.errorMsg = "";
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
        }

    setParam = (path) => {
        const option = {
            SampleRate: 44100.0,
            Channels: 2,
            AudioQuality: 'High',
            AudioEncoding: 'acc',
            OutputFormat: 'mpeg_4',
            MeteringEnabled: false,
            MeasurementMode: false,
            AudioEncodingBitRate: 32000,
            IncludeBase64: true,
            AudioSource: 0,
        }
        AudioRecorder.prepareRecordingAtPath(path, option);
    }

    isPressed(pressed) {
        if (pressed == true) {
            return ' Playing...'
        }
        else {
            return ' Press to Play';
        }
    }

    async playRecording() {
        try {
            RNFS.readFile(this.state.audioPath, "base64").then(res => {console.log(res)});
            let recording = new Sound(this.state.audioPath, '', (err) => {
                if (err) {
                    console.log(err);
                    alert('error: ' + err);
                }
                recording.play(success => {
                    if (success) {
                        console.log(this.state.audioPath);
                        console.log('play success');
                        // RNFS.readFile(this.state.audioPath, "base64").then(res => { console.log(res) });
                    }
                    else {
                        console.log('play failed');
                    }
                })
            })
        }
        catch (err) {
            console.log('error: ' + err);
        }
    }

    async getPostDetailsById(){
        var getPostDetailsURL = 'http://81.68.76.219:80/postdetails';
        if (this.state.id == undefined) {
            return alert("Post Id Error!");
        }
        if (this.state.subject == undefined) {
            return alert("Subject Code Error!");
        }

        var bookIdData = JSON.stringify({
            "book_id": this.state.id,
        });
        const res = await fetch(getPostDetailsURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bookIdData
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                if(responseJson["status"] == 1){
                    this.setState({ topic: responseJson["data"].topic });
                    this.setState({ ISBN: responseJson["data"].ISBN });
                    this.setState({ bookname: responseJson["data"].book_name });
                    this.setState({ description: responseJson["data"].book_description });
                    this.setState({ audio_base64: responseJson["data"].audio_base64 });
                    RNFS.writeFile(this.state.audioPath, responseJson["data"].audio_base64, 'base64');
                    this.setState({ imageList: responseJson["data"].picture_base64 });
                    this.setState({ commentList: responseJson["data"].comments_id });
                    this.setState({ postdate: responseJson["data"].post_date });
                    this.setState({ markcount: responseJson["data"].mark_count });
                    this.setState({ location: responseJson["data"].location });

                    if(responseJson["data"].location){
                        var t = responseJson["data"].location.split(",");
                        var latitude = t[0];
                        var longitude = t[1];

                        var reverseGeocodingURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&location_type=ROOFTOP&result_type=street_address&key=" + API_KEY;
                        fetch(reverseGeocodingURL, {
                            method: "GET",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => response.json())
                        .then(responseJson => {
                            // console.log(responseJson);
                            // console.log(responseJson["results"][0]["formatted_address"]);
                            var location_name = responseJson["results"][0]["formatted_address"];
                            if (location_name != '') {
                                this.setState({ location_name: location_name });
                            }
                            else {
                                this.setState({ location_name: "Location Error." });
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    }
                    else{
                        this.setState({ location_name: "No location provided." });
                    }
                    this.setState({ loaded: 1 });
                }
                else if(responseJson["status"] == -1){
                    alert("Failed to get details. Please try later!");
                }else{
                    alert("Issue-[xxx]: Please contact admin!");
                }
            })
            .catch((error) => {
                alert("Issue-[xxx]:" + error);
            });
    }

    getSession = async (element) => {
        try {
            return await AsyncStorage.getItem(element);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async addNewComment(){
        var addNewCommentURL = 'http://81.68.76.219:80/add/comment';
        let sessionEmail = await this.getSession('sessionEmail');
        try {
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch (err) {

        }

        if (sessionEmail == '') {
            return alert("Invalid login state!");
        }
        if (this.state.comment == '') {
            return alert("Please add the comment!");
        }

        var commentData = JSON.stringify({
            "email": sessionEmail,
            "book_id": this.state.id,
            "comment_content": this.state.comment,
        });
        console.log(commentData);
        const res = await fetch(addNewCommentURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: commentData
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson["status"] == 1) {
                    alert("Submit Successfully!");
                    this.setState({ comment: "" });
                    this.navigation.navigate('PostDetails', {id: this.state.id, subject: this.state.subject});
                } else if (responseJson["status"] == -1) {
                    alert("Failed to submit. Please try later!");
                } else {
                    alert("Issue-[xxx]: Please contact admin!");
                }
            })
            .catch((error) => {
                alert("Issue-[xxx]:" + error);
            });
    }

    componentDidMount(){
        this.getPostDetailsById();
    }

    componentDidUpdate(nextProps){
        if(nextProps != this.props){
            this.getPostDetailsById();
        }
    }

    render = () => {

        let picList = [];
        for (let i = 0; i < this.state.imageList.length; i++) {
            picList.push(
                <View key={"pic_view" + i} style={{ borderWidth: 1, marginTop: 5 }}>
                    <Image key={"image" + i} style={{ height: 200, resizeMode: "contain", marginTop: 5, marginBottom: 5 }} source={{ uri: 'data:image/jpeg;base64,' + this.state.imageList[i] }} />
                </View>
            )
        }

        let commentsList = [];
        for(let i = 0; i < this.state.commentList.length; i++){
            var _comment = this.state.commentList[i];
            commentsList.push(
                <View key={"com_view" + i} style={{ borderWidth: 1, marginTop: 5 }}>
                    <Text style={{ marginLeft: 5 }}>
                        {_comment.email + ":\n\n" + 
                        _comment.comment_content + "\n\n" +
                        _comment.post_date}
                    </Text>
                </View>
            );
        }

        return (
            this.state.loaded == 0 
            ? 
                <View style={{ marginTop: 400 }}>
                    <Text style={{textAlign:'center', fontSize: 15}}>Processing</Text>
                    <ActivityIndicator color="blue" size={50} />
                    <LinearProgress color="primary" variant='indeterminate' number='1'/>
                    
                </View>
            : 
            <NativeBaseProvider>
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h3 style={styles.profile_title}>Post Details</Text>
                        
                        <View style={styles.profile_card_post}>
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Topic</Text>
                                <Text
                                    placeholder="Enter the topic"
                                    onChangeText={(topic) => this.setState({ topic: topic })}
                                >
                       
                                    {this.state.topic}
                                
                                
                                
                                </Text>
                            </View>
                          
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Subject</Text>
                                <Text>{this.state.subject}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Post Date</Text>
                                <Text>{this.state.postdate}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Mark Count</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <Icon size={20} name="star-o" color="orange" />
                                    <Text> {this.state.markcount}</Text>
                                </View>
                            </View >
                    
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>ISBN (optinal)</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 150 }}>
                                        <Text>{this.state.ISBN}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Book Name (optinal)</Text>
                                <Text>{this.state.bookname}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Description</Text>
                                <Text
                                    textAlignVertical="top"
                                    multiline
                                    style={{ borderColor: 'grey', borderWidth: 1, height: 120 }}
                                    maxLength={100}
                                >
                                    {this.state.description}
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Audio (optional)</Text>
                                {this.state.audio_base64 == ''
                                    ?
                                    <Pressable
                                        disabled='true'
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: pressed
                                                    ? 'rgb(210, 230, 255)'
                                                    : 'grey'
                                            },
                                            styles.wrapperCustom
                                        ]}>
                                        {({ pressed }) => (
                                            <Text style={styles.text}>
                                                <Icon name='microphone' size={20} color="#666" />
                                                {this.isPressed(pressed)}
                                            </Text>
                                        )}
                                    </Pressable>
                                    :
                                    <Pressable
                                        onPress={() => this.playRecording()}
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: pressed
                                                    ? 'rgb(210, 230, 255)'
                                                    : '#FFED97'
                                            },
                                            styles.wrapperCustom
                                        ]}>
                                        {({ pressed }) => (
                                            <Text style={styles.text}>
                                                <Icon name='microphone' size={20} color="#666" />
                                                {this.isPressed(pressed)}
                                            </Text>
                                        )}
                                    </Pressable>
                                }
                            </View>
                            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold", paddingTop: 20 }}>Pictures</Text>
                            <View style={{ flexDirection: "row" }}>
                                <ScrollView>
                                    {picList}
                                </ScrollView>
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Location</Text>
                                <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center" }}>
                                    {this.state.location == ''
                                        ?
                                        <Icon name='map-marker' size={20} color="grey" />
                                        :
                                        <Icon name='map-marker' size={20} color="#FF0000" />
                                    }
                                    <Text> {this.state.location == '' ? "not provided" : this.state.location_name}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Comments</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <TextInput
                                        value={this.state.comment}
                                        textAlignVertical="top"
                                        placeholder="Add your comment here (100 words limited)"
                                        multiline
                                        style={{ flex: 4, marginTop: 5, marginBottom: 10, marginEnd: 10, borderColor: 'grey', borderWidth: 1, height: 60 }}
                                        onChangeText={(comment) => this.setState({ comment: comment })}
                                        maxLength={100}
                                    />
                                    <View style={{ flex: 2, marginTop: 15 }}>
                                        <FAB 
                                       icon={{ name: 'add', color: 'white' }}
                                       color="blue" title='Add' onPress={() => this.addNewComment()} />
                                    </View>
                                </View>
                                {/* size= 'small'  color="blue" title='Submit' */}
                                {commentsList}
                            </View>
                            <View >
                                <Text></Text>
                                <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Rate Post</Text>
                                <AirbnbRating/>
                            </View>
                        </View>

                       
                    </ScrollView>
                </LinearGradient>

           
        </NativeBaseProvider>

                        
        )
    }
}


export default postDetails;