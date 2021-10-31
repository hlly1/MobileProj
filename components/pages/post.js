import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Pressable, Button, Image, StyleSheet, StatusBar, ScrollView} from 'react-native';
import {Input} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from "../../styles/style";
import {NativeBaseProvider} from 'native-base';


class Post extends Component{
  constructor(props) {
    super(props);
    this.state = {
        pressed: false
    };
  }
  state={
    topic :"",
    ISBN: "",
    bookname: "", 
    description: "",
    imageList:[]
  }

  getCurrentPosition

  render(){
    const {topic, ISBN, bookname, description, imageList} = this.state

    return(
      <NativeBaseProvider>
                <LinearGradient colors={['#33AFFF', '#3b5998', '#192f6a']} style={styles.linearGradient}>
                    <StatusBar backgroundColor='transparent' translucent={true} />
                    <ScrollView showsVerticalScrollIndicator = {false}>
                    <Text h3 style={styles.profile_title}>Create Post</Text>


                    <View style={styles.profile_card_post}>
                      {/* 1.0 Topic start */}
                      <View>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>Topic</Text>
                      <Input 
                      value = {topic}
                      placeholder = "Enter the topic"
                      onChangeText={(topic)=>this.setState({topic})}
                      />
                      </View> 
                      {/* 1.0 Topic end */}
                      {/* 2.0 ISBN start */}
                      <View>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>ISBN(optinal)</Text>
                      <View style = {{flexDirection:'row'}}>      
                        <View style = {{width:150}}>
                          <Input 
                          value = {ISBN}
                          placeholder = "Enter ISBN"
                          onChangeText={(ISBN)=>this.setState({ISBN})}
                          />
                        </View>
                        <View style = {{width:100, height:80}}>
                          <Button colorScheme="teal" title={"ISBN Submit"}/>
                        </View>
                      </View>
                      </View> 
                      {/* 2.0 ISBN end */}
                      {/* 3.0 bookname start */}
                      <View>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>Book Name(optinal)</Text>
                      <Input 
                      value = {bookname}
                      placeholder = "Enter the book name"
                      onChangeText={(bookname)=>this.setState({bookname})}
                      />
                      </View> 
                      {/* 3.0 bookname end */}
                      {/* 4.0 description start */}
                      <View>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>Description</Text>
                      <TouchableOpacity>
                      <TextInput 
                        value = {description}
                        textAlignVertical = "top"
                        placeholder="Description of the book (100 words limited)"
                        multiline
                        style = {{borderColor: 'grey', borderWidth:1, height: 120}}
                        onChangeText={(description)=>this.setState({description})}
                        maxLength = {100}
                      />
                      </TouchableOpacity>
                      </View> 
                      {/* 4.0 description end */}
                      {/* 5.0 audio start */}
                      <View style={styles.container}>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>Audio(optional)</Text>
                        <Pressable style={({ pressed }) => [
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
                              {pressed ? ' Release to end' : ' Hold to talk'}
                            </Text>
                          )}
                        </Pressable>
                      </View>
                      {/* 5.0 audio end */}
                      {/* 6.0 pictures start */}
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold", paddingTop:20}}>Pictures</Text>
                      <View style = {{flexDirection:"row"}}>
                      <TouchableOpacity>
                        <Icon name='image' size={60} color="#4F8EF7" />
                      </TouchableOpacity>
                      <ScrollView horizontal>
                        {/* {imageList.map((v, j) => <Image
                          source={{uri:v.uri}}
                          style={{width:60, height:60}}
                        />)} */}
                      </ScrollView>
                      </View> 
                      {/* 6.0 pictures end */}
                      {/* 7.0 Location start */}
                      <View style = {{paddingTop:20}}>
                      <Text style = {{fontSize:20,color:"#666",fontWeight:"bold"}}>Location</Text>
                      <TouchableOpacity style = {{flexDirection:"row"}}>
                        <Icon name='map-marker' size={20} color="#666" />
                        <Text> Where is the book?</Text>
                      </TouchableOpacity>
                      </View> 
                      {/* 7.0 Location end */}
                      {/* 8.0 Submit start */}
                      <View>
                      <TouchableOpacity>
                          <LinearGradient colors={['#3AA8FE','#72DD00']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.post_submit_button_adjust} >
                            <Text style={styles.login_button}>Submit</Text>
                          </LinearGradient>
                      </TouchableOpacity>
                      </View>
                      {/* 8.0 Submit end */}
                      
                    </View>
                    </ScrollView>
                </LinearGradient>
        </NativeBaseProvider>
    )
  }
}

export default Post;
