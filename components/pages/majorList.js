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
import { backgroundColor, fontSize, justifyContent, left } from "styled-system";
import { it } from "jest-circus";
import {comps} from "../../styles/comp.js";
import { NativeBaseProvider, Box, Center } from 'native-base';

export default class MajorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [{
                "id": "1",
                "name": "Information Technology",
                "imgUrl": "http://81.68.76.219/static/information.jpeg"
            }, {
                "id": "2",
                "name": "Business",
                "imgUrl": "http://81.68.76.219/static/business.jpeg"
            }, {
                "id": "3",
                "name": "Language",
                "imgUrl": "http://81.68.76.219/static/language.jpeg"
            }, {
                "id": "4",
                "name": "Mechanical Engineering",
                "imgUrl": "http://81.68.76.219/static/mechanical.jpeg"
            }, {
                "id": "5",
                "name": "Chemical Engineering",
                "imgUrl": "http://81.68.76.219/static/chemical.jpeg"
            }, {
                "id": "6",
                "name": "Education",
                "imgUrl": "http://81.68.76.219/static/education.jpeg"
            }],
            new_categories: [],
            text: '',
            originList: [],
            list: []
        }
        // this.handleGetListSucc = this.handleGetListSucc.bind(this)

    }

    handleItemClick(majorName) {
        this.props.navigation.navigate('SubjectList', {majorName: majorName})
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
        const columnNum = 2
        const pictWidth = (width - 20) 
        const textHeight = 30
        return (
      
            <View style={styles.container}>
                <LinearGradient colors={['#9b63cd', '#e0708c']} style={styles.headerStyle}>
                    
                    <View style={styles.headerSearchStyle}>
                        <Image source={require("../../assets/imgs/search.png")} style={styles.headerSearchIcon}/>
                        <TextInput 
                        style={styles.headerInputText}
                        placeholder='Find your major'
                        onChangeText={(text) => this.onChangeText(text)}
                        value = {this.state.text}
                        /> 

                    </View>

                    
                    
                    
                    <FlatList style={styles.searchItem}
                        data={this.state.list}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.handleItemClick.bind(this, item.name)}>
                                    <View style={{paddingTop:8}}>
                                        <Text>{item.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback >
                                
                            )
                        }
                    }/>
                </LinearGradient>

                <ScrollView>
                {
                    this.state.categories.map((item, value) => {
                        return (
                            <TouchableWithoutFeedback key={item.id} onPress={this.handleItemClick.bind(this, item.name)}>
                                <View key={item.id} style={[styles.item, {width: pictWidth}]}>
                                    <Image 
                                        source={{uri: item.imgUrl}} 
                                        style={styles.itemImg}
                                    />
                                    <View style={styles.info}>
                                        <Text style={styles.desc}>Master of {item.name}</Text>
                                        <Text style={styles.title}>Related Posts: {item.id}</Text>
                                    </View>
                                    
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
                
                </ScrollView>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    headerStyle: {
        height: 110,
        zIndex: 1
    },
    headerTextStyle: {
        textAlign: 'center',
        marginTop: '5%',
        color: 'white',
        zIndex: 1
    },
    headerSearchStyle: {
        height:10,
        flexDirection: 'row',   // 水平排布  
        flex:1,
        borderRadius: 5,  // 设置圆角边  
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 20,  
        marginRight: 20,
        marginBottom: 20
    },
    headerSearchIcon: {
        height: 15, 
        width: 15, 
        marginLeft: 15, 
        resizeMode: 'stretch'
    },
    headerInputText: {
        flex:1,
        backgroundColor:'transparent',
        fontSize:15,
        marginLeft: 5
    },
    searchItem: {
        position: 'absolute', 
        marginTop: '10%', 
        zIndex: 1,
        backgroundColor: '#fff',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 2,
        paddingLeft: 15

    },
    item: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,  
    },
    itemImg: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 20,
        marginBottom: 10,
        width:80,
        height:80,
        zIndex:1,
        borderRadius:12,

    },
    info: {
        flex:1,
        display: 'flex',
        justifyContent: 'center',
        zIndex:1
    },
    title: {
        lineHeight: 20,
        fontSize: 12,
        zIndex:1
    },
    desc: {
        lineHeight: 20,
        fontSize: 16,
        zIndex:1
    }
    
})