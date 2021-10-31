import React, { Component } from "react";
import 'react-native-gesture-handler';
import {
    View,
    TextInput,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    TouchableHighlight,
    Image,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Text, Avatar } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import Tabbar from '../tabbar.js';
import { Overlay } from "react-native-elements/dist/overlay/Overlay";
import { Input } from "react-native-elements/dist/input/Input";
import { backgroundColor, borderWidth, flex, fontSize, height, justifyContent, left, marginBottom } from "styled-system";
import { it } from "jest-circus";




export default class subjectList extends Component{ 
    constructor(props) {
        super(props)
        this.state = {
            categories: [{
                "id": "1",
                "name": "帖子信息1",
                "imgUrl": "../../assets/imgs/unimelb-logo.png",
                "Time": "2018-25-12 23:50"
            }, {
                "id": "2",
                "name": "帖子信息2",
                "imgUrl": "../../assets/imgs/unimelb-logo.png",
                "Time": "2018-25-12 23:50"
            }, {
                "id": "3",
                "name": "帖子信息3",
                "imgUrl": "../../assets/imgs/unimelb-logo.png"
            }, {
                "id": "4",
                "name": "帖子信息4",
                "imgUrl": "../../assets/imgs/unimelb-logo.png"
            }, {
                "id": "5",
                "name": "帖子信息5",
                "imgUrl": "../../assets/imgs/unimelb-logo.png"
            }, {
                "id": "6",
                "name": "帖子信息6",
                "imgUrl": "../../assets/imgs/unimelb-logo.png"
            }, {
                "id": "6",
                "name": "帖子信息6",
                "imgUrl": "../../assets/imgs/unimelb-logo.png"
            }],
            new_categories: [],
            text: '',
            originList: [],
            list: []
        }
        // this.handleGetListSucc = this.handleGetListSucc.bind(this)

    }

    handleItemClick(majorId) {
        this.props.navigation.navigate('CourseList', {id: majorId})
    }

    onChangeText = (text) => {
        this.setState({
            text,
            list: this.filterText(text)
        })
    }

    filterText = (text) => {
        let data = this.state.categories
        if (text) {
            return data.filter((v) => {
                return v.id.toLowerCase().includes(text.toLowerCase()) | v.name.toLowerCase().includes(text.toLowerCase())
                // return Object.keys(v).some((key) => {
                //     return String(v[key]).toLowerCase().includes(text.toLowerCase())
                // })
            })
        }
        return []
    }


    render() {
        const {width} = Dimensions.get('window')
        
        const pictWidth = (width - 20) 
        const textHeight = 30
        return (
            <View style={styles.container}>
                  <View style={styles.headerStyle}>
                    
                    <Text style={styles.headerTextStyle}> Post List </Text>
                    
                  </View>
           
                <ScrollView>
                {
                    this.state.categories.map((item, value) => {
                        return (
                            <TouchableWithoutFeedback key={item.id} onPress={this.handleItemClick.bind(this, item.id)}>
                                <View key={item.id} style={[styles.item, {width: pictWidth}]}>
                                    <View style={styles.info}> 
                                        <Text style={styles.title}>Post ID: {item.id}</Text>
                                        <Text style={styles.desc}>{item.name}</Text>
                                        <Text style={styles.Time}>Time:</Text>
                                    </View>
                                    <Image 
                                        source={require("../../assets/imgs/start.png")} 
                                        style={styles.itemImg}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
                
                </ScrollView>

             


                {/* <View style={styles.headerStyle}>
                    
                    <Text style={styles.headerTextStyle}> Unimelb Major List </Text>
                    <TextInput 
                        style={styles.headerSearchStyle} 
                        placeholder='Create a post'
                        onChangeText={(text) => this.onChangeText(text)}
                        value = {this.state.text}
                    /> 
                    
                    
                </View> */}

            </View>

            
            
        )
    }
}

const styles = StyleSheet.create({

    

    container: {
        flex: 1,
        backgroundColor: '#eee',
        position: "absolute"
    },
    headerStyle: {
        height: '13%',
        backgroundColor: 'blue',
        
    },
    headerTextStyle: {
        textAlign: 'center',
        marginTop: '15%',
        color: 'white',
        fontSize: 20,
    },
    headerSearchStyle: {
        position: 'absolute',
        marginTop: '5%',
        backgroundColor: '#fff',
        left: 20,
        right: 20,
        height: 40,
        top: 40,
        lineHeight: 5,
        paddingLeft: 10,
        borderRadius: 5,
        zIndex: 2
    },
    searchItem: {
        position: 'absolute', 
        marginTop: '5%', 
        zIndex: 1,
        backgroundColor: '#fff',
        top: 50,
        left: 20,
        right: 20,
        zIndex:1,

    },
    item: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        height:90,
        borderWidth: 1,
    
        
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    itemImg: {
        width:60,
        height:60,
        zIndex:-1,
      
        flex:10,
        
        justifyContent: 'flex-end',
    },
    info: {
        
        flex:50,
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: 0,
      
        zIndex:-1
    },
    title: {
        lineHeight: 20,
        fontSize: 12,
        zIndex:-1,
        height: 30,
       
    },

    Time: {
        lineHeight: 20,
        fontSize: 10,
        zIndex:-1
    },
    desc: {
        lineHeight: 20,
        fontSize: 16,
        zIndex:-1
    }
    
})