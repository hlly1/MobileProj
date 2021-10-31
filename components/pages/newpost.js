import React, {Component} from 'react';
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Pressable, 
  Button, 
  Image, 
  StyleSheet, 
  ScrollView} from 'react-native';
import {Input} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
// import {NativeBaseProvider, Icon, Button, AddIcon} from 'native-base';

import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from "react-native-sound";
import RNFS from "react-native-fs";

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage";

class newPost extends Component{
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      topic: "",
      subject: props.route.params.subject,
      ISBN: "",
      bookname: "",
      description: "",
      imageList: [],
      // image: "",
      location: "",

      hasPermission: undefined,
      audioPath: AudioUtils.DocumentDirectoryPath + '/AudioDescription.acc',
      recorded: false,
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
      if (this.state.recorded == true) {
        return ' Play Recording...';
      }
      else {
        return ' Recording...';
      }
    }
    else {
      if (this.state.recorded == true) {
        return ' Press to Play';
      }
      else {
        return ' Hold to Record';
      }
    }
  }

  async startRecording() {
    try {
      if (this.state.hasPermission == false) {
        alert('Audio Access Denied!');
      }
      else {
        if (this.state.recorded == false) {
          console.log('start recording...');
          this.setParam(this.state.audioPath);
          await AudioRecorder.startRecording();
        }
        else {

        }
      }
    }
    catch (err) {
      console.log('error: ' + err);
    }
  }

  async stopRecording() {
    try {
      if (this.state.recorded == false) {
        await AudioRecorder.stopRecording();
        this.setState({ recorded: true });
        console.log('stop recording...');
        RNFS.readFile(this.state.audioPath, "base64").then(res => { this.setState({ audio_base64: res }) });
      }
      else {
        console.log('stop playing...');
      }
    }
    catch (err) {
      console.log('error: ' + err);
    }
  }

  async playRecording() {
    try {
      if (this.state.recorded == true) {
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
              // RNFS.readFile(this.state.audioPath, "base64").then(res => { console.log(res) });
            }
            else {
              console.log('play failed');
            }
          })
        })
      }
    }
    catch (err) {
      console.log('error: ' + err);
    }
  }

  selectImage = () => {
    let options = {
      storageOption: {
        path: 'images',
        mediaType: 'photo'
      },
      includeBase64: true
    };

    launchImageLibrary(options, (response) => {
      console.log('response: ', response);
      if (response.didCancel) {
        console.log('cancelled image picker');
      } else if (response.error) {
        console.log('imagePicker error: ', response.assets.error);
      } else if (response.customButton) {
        console.log('imagePicker button tapped: ', response.assets.customButton);
      } else {
        // console.log(response.assets.base64);
        this.state.imageList.push(response["assets"][0]["base64"]);
        this.setState({ imageList: this.state.imageList });
      }
    });
  }

  uploadByCamera = () => {
    let options = {
      storageOption: {
        path: 'images',
        mediaType: 'photo'
      },
      includeBase64: true
    };

    launchCamera(options, (response) => {
      console.log('response: ', response);
      if (response.didCancel) {
        console.log('cancelled image picker');
      } else if (response.error) {
        console.log('imagePicker error: ', response.error);
      } else if (response.customButton) {
        console.log('imagePicker button tapped: ', response.customButton);
      } else {
        this.state.imageList.push(response["assets"][0]["base64"]);
        this.setState({ imageList: this.state.imageList });
      }
    });
  }

  async getBookInfoByISBN(){
    var getBoookInfoURL = 'http://81.68.76.219:80/ISBN';
    var getBookInfo = JSON.stringify({
      "ISBN": this.state.ISBN,
    });
    console.log(getBookInfo);
    const res = await fetch(getBoookInfoURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: getBookInfo
    })
    .then(response => response.json())
    .then(responseJSON => {
      console.log(responseJSON);
      if(responseJSON["status"] == 1){
        if(responseJSON["title"] != null){
          this.setState({ bookname: responseJSON["title"] });
          console.log(this.state.bookname);
        }
        if (responseJSON["pic"] != null){
          // console.log(responseJSON["pic"]);
          for (let i = 0; i < responseJSON["pic"].length; i++){
            this.state.imageList.push(responseJSON["pic"][i]);
          }
          this.setState({ imageList: this.state.imageList});
          // console.log(this.state.imageList.length);
          // for (let i = 0; i < this.state.imageList.length; i++) {
          //   this.state.imageList[i] = 'data:image/jpeg;base64,' + this.state.imageList[i];           
          // }
          // this.setState({ image: 'data:image/jpeg;base64,' + responseJSON["pic"]});
        }
      }
      else if(responseJSON["status"] == -1){
        alert("Failed to fetch book info from database");
      } else {
        alert("Issue-[xxx]: Please contact admin!");
      }
    })
    .catch((error) => {
      alert("Issue-[xxx]:" + error);
    })
  }

  getSession = async (element) => {
    try {
      return await AsyncStorage.getItem(element);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async addNewPost(){
    var addNewPostURL = 'http://81.68.76.219:80/add/book';
    let sessionEmail = await this.getSession('sessionEmail');
    try {
      // to solve an unknown format bug in different developing environment
      sessionEmail = JSON.parse(sessionEmail);
    }
    catch (err) {

    }

    if(sessionEmail == ''){
      return alert("Invalid login state!");
    }
    if(this.state.topic == ''){
      return alert("Please add the topic!");
    }
    if(this.state.subject == ''){
      return alert("Invalid subject code!");
    }
    if(this.state.description == ''){
      return alert("Please add some desription!");
    }
    if (this.state.imageList == []) {
      return alert("Please upload pictures!");
    }
    // if(this.state.image == ''){
    //   return alert("Please upload pictures!");
    // }
    // if(this.state.location == ''){
    //   return alert("Please provide the location!");
    // }

    if(this.state.recorded == false){
      this.setState({ audio_base64: "" });
    }

    var postInfoData = JSON.stringify({
      "email": sessionEmail,
      "topic": this.state.topic,
      "book_name": this.state.bookname,
      "book_description": this.state.description,
      "audio_base64": this.state.audio_base64,
      "ISBN": this.state.ISBN,
      "picture_base64": this.state.imageList,
      // "picture_base64": this.state.image,
      "subject_code": this.state.subject,
    });
    console.log(postInfoData);
    const res = await fetch(addNewPostURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: postInfoData
    })
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson["status"] == 1){
        alert("Submit Successfully!");
        this.navigation.navigate('TestPage', {});
        // this.navigation.navigate('PostList', {});
      }else if(responseJson["status"] == -1){
        alert("Failed to submit. Please try later!");
      }else{
        alert("Issue-[xxx]: Please contact admin!");
      }
    })
    .catch((error) => {
      alert("Issue-[xxx]:" + error);
    });
  }

  removePictureByKey(key){
    this.state.imageList.splice(key, 1);
    this.setState({ imageList: this.state.imageList });
  }

  test(){
    console.log(1);
    this.navigation.navigate('TestPage', {});
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization()
      .then(isAuth => {
        if (isAuth == false) {
          return alert('Audio Access Denied!');
        }
        this.setState({ hasPermission: isAuth });
      });
  }

  render(){

    let picList = [];

    for (let i = 0; i < this.state.imageList.length; i++) {
      picList.push(
        <View key={"view" + i} style={{ flexDirection: "row", borderWidth: 1, marginTop: 5 }}>
          <Image key={"image" + i} style={{ flex: 95, height: 200, resizeMode: "contain", marginTop: 5, marginBottom: 5 }} source={{ uri: 'data:image/jpeg;base64,' + this.state.imageList[i] }} />
          <Icon key={"icon" + i} name='times-circle-o' size={22} style={{ flex: 5, color: "red" }} onPress={this.removePictureByKey.bind(this, i)} />
        </View>
      )
    }

    return(
      <ScrollView>
        <View style={{ backgroundColor: "#fff", flex: 1, padding: 10 }}>
          {/* 1.0 Topic start */}
          <View>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Topic</Text>
            <Input
              value={this.state.topic}
              placeholder="Enter the topic"
              onChangeText={(topic) => this.setState({ topic: topic })}
            />
          </View>
          {/* 1.0 Topic end */}

          <View>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Subject</Text>
            <Input
              value={this.state.subject}
              disabled={true}
            />
          </View>

          {/* 2.0 ISBN start */}
          <View>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>ISBN (optinal)</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 150 }}>
                <Input
                  value={this.state.ISBN}
                  placeholder="Enter ISBN"
                  onChangeText={(ISBN) => this.setState({ISBN: ISBN })}
                />
              </View>
              <View style={{ width: 100, height: 80 }}>
                <Button colorScheme="teal" title={"ISBN Submit"} onPress={() => this.getBookInfoByISBN()} />
              </View>
            </View>
          </View>
          {/* 2.0 ISBN end */}
          {/* 3.0 bookname start */}
          <View>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Book Name (optinal)</Text>
            <Input
              value={this.state.bookname}
              placeholder="Enter the book name"
              onChangeText={(bookname) => this.setState({ bookname: bookname })}
            />
          </View>
          {/* 3.0 bookname end */}
          {/* 4.0 description start */}
          <View>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Description</Text>
            <TouchableOpacity>
              <TextInput
                value={this.state.description}
                textAlignVertical="top"
                placeholder="Description of the book (100 words limited)"
                multiline
                style={{ borderColor: 'grey', borderWidth: 1, height: 120 }}
                onChangeText={(description) => this.setState({ description: description })}
                maxLength={100}
              />
            </TouchableOpacity>
          </View>
          {/* 4.0 description end */}
          {/* 5.0 audio start */}
          <View style={styles.container}>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Audio (optional)</Text>
            <Pressable
              onLongPress={() => this.startRecording()}
              onPressOut={() => this.stopRecording()}
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
            <View style={{ paddingTop: 5 }}>
              <Button title='reset' onPress={() => { this.setState({ recorded: false }) }} />
            </View>
          </View>
          {/* 5.0 audio end */}
          {/* 6.0 pictures start */}
          <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold", paddingTop: 20 }}>Pictures</Text>
          <View style={{ flexDirection: "row" }}>
            {/* <TouchableOpacity>
              <Icon name='image' size={60} color="#4F8EF7" />
            </TouchableOpacity> */}
            {/* <ScrollView horizontal>
              {this.state.imageList != null 
              ? 
              this.state.imageList.map((v, j) => 
                <Image source={{uri:v.uri}}style={{width:60, height:60}} />
              )
              :
                <Icon name='image' size={60} color="#4F8EF7" />
              }
            </ScrollView> */}
            <ScrollView>
              {/* {this.state.imageList.length != 0
              {this.state.image != ''
              ?
              <View style={{ borderWidth: 1, marginTop: 5 }}>
                <Image style={{ height: 200, resizeMode: "contain", marginTop: 5, marginBottom: 5 }} source={{ uri: this.state.image }} />
              </View> */}
              { picList }
              {/* :
              null
              } */}
              {/* {this.state.imageList != ''
              ?
                <View style={{ borderWidth: 1, marginTop: 5 }}>
                  <Image style={{ height: 200, resizeMode: "contain", marginTop: 5, marginBottom: 5 }} source={{ uri: 'data:image/jpeg;base64,' + this.state.imageList[0] }} />
                </View>
              :
              null
              } */}
              {/* <View style={{ borderWidth: 1, marginTop: 5 }}>
                <Icon name='upload' style={{ alignSelf: "center", marginTop: 5 }} size={100} color="#4F8EF7" onPress={() => this.test()} />
              </View> */}
              <View style={{ marginTop: 5 }}>
                <Button title='Upload by Gallery' onPress={() => this.selectImage()} />
              </View>
              <View style={{ marginTop: 5 }}>
                <Button title='Upload by Camera' onPress={() => this.uploadByCamera()} />
              </View>
            </ScrollView>
            
          </View>
          {/* 6.0 pictures end */}
          {/* 7.0 Location start */}
          <View style={{ paddingTop: 20 }}>
            <Text style={{ fontSize: 20, color: "#666", fontWeight: "bold" }}>Location</Text>
            <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center" }}>
              <Icon name='map-marker' size={20} color="#666" />
              <Text> Where is the book?</Text>
            </TouchableOpacity>
          </View>
          {/* 7.0 Location end */}
          {/* 8.0 Submit start */}
          <View style={{ paddingTop: 20 }}>
            <Button title={"Submit"} color={'green'} 
            // onPress={() => this.test()} 
            onPress={() => this.addNewPost()} 
            />
          </View>
          {/* 8.0 Submit end */}

        </View>
      </ScrollView>
    );
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

export default newPost;
