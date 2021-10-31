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
    ScrollView
} from 'react-native';
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
// import {NativeBaseProvider, Icon, Button, AddIcon} from 'native-base';

import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage";

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
            postdate: "",
            markcount: "",
            commentList: [],
            comment: "",

            hasPermission: undefined,
            audioPath: AudioUtils.DocumentDirectoryPath + '/Audio' + props.route.params.id + '.acc',
            audio_base64: "",
        };
        this.errorMsg = "";
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
                    // this.setState({ ISBN: responseJson["data"].ISBN });
                    this.setState({ bookname: responseJson["data"].book_name });
                    this.setState({ description: responseJson["data"].book_description });
                    this.setState({ audio_base64: responseJson["data"].audio_base64 });
                    RNFS.writeFile(this.state.audioPath, responseJson["data"].audio_base64, 'base64');
                    this.setState({ imageList: responseJson["data"].picture_base64 });
                    this.setState({ commentList: responseJson["data"].comments_id });
                    this.setState({ postdate: responseJson["data"].post_date });
                    this.setState({ markcount: responseJson["data"].mark_count });
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
            _comment = this.state.commentList[i];
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
            <ScrollView>
                <View style={{ backgroundColor: "#fff", flex: 1, padding: 10 }}>
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
                            <Text>{this.state.markcount}</Text>
                        </View>
                    </View>
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
                            <Text> {this.state.location == '' ? "not provided" : this.state.location}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Comments</Text>
                        {commentsList}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    },
    text: {
        textAlign: "center",
    },
    wrapperCustom: {
        borderRadius: 8,
        padding: 6,
        borderColor: "grey",
        borderWidth: 1
    },
});

export default postDetails;