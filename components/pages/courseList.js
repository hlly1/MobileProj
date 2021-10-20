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
import { backgroundColor, left, position } from "styled-system";
import { it } from "jest-circus";
import {comps} from "../../styles/comp.js";

export default class CourseList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            categories: [{
                "id": "0001",
                "title": "COMP90001",
                "cname:": "Mobile Computing 1",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0002",
                "title": "COMP90002",
                "cname:": "Mobile Computing 2",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            },{
                "id": "0003",
                "title": "COMP90003",
                "cname:": "Mobile Computing 3",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0004",
                "title": "COMP90004",
                "cname:": "Mobile Computing 4",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0005",
                "title": "COMP90005",
                "cname:": "Mobile Computing 5",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0006",
                "title": "COMP90006",
                "cname:": "Mobile Computing 6",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0007",
                "title": "COMP90007",
                "cname:": "Mobile Computing 7",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0008",
                "title": "COMP90008",
                "cname:": "Mobile Computing 8",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0009",
                "title": "COMP90009",
                "cname:": "Mobile Computing 9",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0010",
                "title": "COMP90010",
                "cname:": "Mobile Computing 10",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0011",
                "title": "COMP90011",
                "cname:": "Mobile Computing 11",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }, {
                "id": "0012",
                "title": "COMP90012",
                "cname:": "Mobile Computing 12",
                "imgUrl": "../../resource/imgs/unimelb_logo.png"
            }],
            new_categories: [],
            text: '',
            originList: [],
            list: []
        }
        // this.handleGetListSucc = this.handleGetListSucc.bind(this)
    }

    componentDidMount() {
        alert("提取有关 major:" + this.props.route.params.id + "的相关帖子")
        // alert(this.props.navigation.state.params.id)
        // fetch('192.168.0.5/courseList')
        // .then((res) => res.json())
        // .then(this.handleGetListSucc)
        // .catch(() => {alert('请求异常')})
    }

    // handleGetListSucc(res) {
    //     if (res.ret && res.data) {
    //         this.setState({
    //             categories: res.data.categories
    //         })
    //     }
    // }

    handleItemClick(courseId) {
        const {navigate} = this.props.navigation;
        navigate('MajorList', {courseId: courseId})
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
                return v.id.toLowerCase().includes(text.toLowerCase()) | v.title.toLowerCase().includes(text.toLowerCase()) | v["cname:"].toLowerCase().includes(text.toLowerCase())
                // return Object.keys(v).some((key) => {
                //     return String(v[key]).toLowerCase().includes(text.toLowerCase())
                // })
            })
        }
        return []
    }

    // _listEmptyComponent = () => {
    //     return (
    //         <View style={{height: 0}}></View>
    //     )
    // }

    render() {
        const {width} = Dimensions.get('window')
        const columnNum = 2
        const pictWidth = (width - 40) / columnNum - 10
        const textHeight = 30
        return (
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    
                    <Text style={styles.headerTextStyle}> Unimelb Course List </Text>
                    <TextInput 
                        style={styles.headerSearchStyle} 
                        placeholder='Find your course'
                        onChangeText={(text) => this.onChangeText(text)}
                        value = {this.state.text}
                        /> 
                    
                    
                    <FlatList style={styles.searchItem}
                        data={this.state.list}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.handleItemClick.bind(this, item.id)}>
                                    <View style={{paddingTop:8}}>
                                        <Text>{item.title} {item["cname:"]}</Text>
                                    </View>
                                </TouchableWithoutFeedback >
                                
                            )
                        }
                    }/>
                </View>

                <ScrollView style={styles.content}>
                
                    <View style={styles.list}>
                        {
                            this.state.categories.map((item) => {
                                return (
                                    <TouchableWithoutFeedback key={item.id} onPress={this.handleItemClick.bind(this, item.id)}>
                                        <View style={[styles.cardStyle, {width: pictWidth}]}> 
                                        {/* source={{uri: item.imgUrl}} */}
                                            <Image source={require("../../resource/imgs/unimelb_logo.png")} style={[{width: pictWidth, height: pictWidth-2*textHeight}, styles.cardImage]}/>
                            
                                            <Text style={styles.itemTitle}>{item.title}</Text>
                                            <Text style={styles.itemTitle}>{item["cname:"]}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    
                                )
                            })
                        }
                    </View>

                </ScrollView>
                
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
        height: '12%',
        backgroundColor: 'blue'
    },
    headerTextStyle: {
        textAlign: 'center',
        marginTop: '5%',
        color: 'white'
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
        paddingBottom:10,
        borderRadius: 5,
        zIndex:2
    },
    searchItem: {
        position: 'absolute', 
        marginTop: '10%', 
        zIndex: 1,
        backgroundColor: '#fff',
        top: 50,
        left: 20,
        right: 20,
        zIndex:1,

    },
    content: {
        flex: 1,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        zIndex:-1
    },
    list: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex:-1
    },
    cardStyle: {
        display: 'flex',
        backgroundColor:'white', 
        marginLeft:10, 
        marginRight:10, 
        marginTop:15, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        borderRadius: 30,
        zIndex:-1
    },
    cardImage: {
        zIndex: -1, 
        borderTopLeftRadius:30, 
        borderTopRightRadius:30,
    },
    itemTitle: {
        textAlign: 'center',
        height: 30,
        lineHeight: 30,
        zIndex:-1
    }
    
})

