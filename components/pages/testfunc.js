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
    LayoutAnimation,
    StyleSheet,
    Pressable,
} from "react-native";
import { styles } from "../../styles/style";
import LinearGradient from 'react-native-linear-gradient';
import { SocialIcon, Image, Text, Input } from 'react-native-elements';
import Validator from '../tools/validator.js';
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resolvePlugin } from "@babel/core";
import { flexDirection, marginRight, padding } from "styled-system";

import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

class TestFunc extends Component{
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            hasPermission: undefined,
            audioPath: AudioUtils.DocumentDirectoryPath + '/AudioDescription.acc',
            recorded: false,
        };
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

    componentDidMount() {
        AudioRecorder.requestAuthorization()
        .then(isAuth => {
            if(isAuth == false){
                return alert('Audio Access Denied!');
            }
            this.setState({ hasPermission: isAuth });
        })
    }

    isPressed(pressed) {
        if(pressed == true){
            if(this.state.recorded == true){
                return 'Play Recording...';
            }
            else{
                return 'Recording...';
            }
        }
        else{
            if (this.state.recorded == true) {
                return 'Press to Play Record';
            }
            else {
                return 'Long Press to Record';
            }
        }
    }

    async startRecording() {
        try{
            if(this.state.hasPermission == false){
                alert('Audio Access Denied!');
            }
            else{
                if(this.state.recorded == false){
                    console.log('start recording...');
                    this.setParam(this.state.audioPath);
                    await AudioRecorder.startRecording();
                }
                else{

                }
            }
        }
        catch(err) {
            console.log('error: ' + err);
        }
    }

    async stopRecording() {
        try{
            if(this.state.recorded == false){
                await AudioRecorder.stopRecording();
                this.setState({ recorded: true });
                console.log('stop recording...');
            }
            else{
                console.log('stop playing...');
            }
        }
        catch(err){
            console.log('error: ' + err);
        }
    }

    async playRecording() {
        try{
            if(this.state.recorded == true){
                console.log('start playing...');
                let recording = new Sound(this.state.audioPath, '', (err) => {
                    if (err) {
                        console.log(err);
                        alert('error: ' + err);
                    }
                    recording.play(success => {
                        if (success) {
                            console.log(this.state.audioPath);
                            console.log('play success');
                            RNFS.readFile(this.state.audioPath, "base64").then(res => {console.log(res)});
                        }
                        else {
                            console.log('play failed');
                        }
                    })
                })
            }
        }
        catch(err){
            console.log('error: ' + err);
        }
    }

    render = () => {
        return(
            <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.profile_title}>Fuction Testing</Text>
                    <View style={styles.profile_card}>
                        <Pressable onLongPress={() => this.startRecording()} onPressOut={() => this.stopRecording()} onPress={() => this.playRecording()}>
                            {({ pressed }) => (
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>
                                    {this.isPressed(pressed)}
                                </Text>
                            )}
                        </Pressable>
                        <Button title='reset' onPress={() => {this.setState({ recorded: false })}} />
                    </View>
                </ScrollView>
            </LinearGradient>
        );
    }
}

export default TestFunc;