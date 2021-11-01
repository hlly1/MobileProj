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

export default class MajorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [{
                "id": "1",
                "name": "Information Technology",
                "imgUrl": require("../../assets/imgs/IT.jpeg")
            }, {
                "id": "2",
                "name": "Business",
                "imgUrl": require("../../assets/imgs/business.jpeg")
            }, {
                "id": "3",
                "name": "Master of Accounting",
                "imgUrl": require("../../assets/imgs/unimelb-logo.png")
            }, {
                "id": "4",
                "name": "Master of Language",
                "imgUrl": require("../../assets/imgs/unimelb-logo.png")
            }, {
                "id": "5",
                "name": "Master of Data Science",
                "imgUrl": require("../../assets/imgs/unimelb-logo.png")
            }, {
                "id": "6",
                "name": "Master of Mechanical Engineering",
                "imgUrl": require("../../assets/imgs/unimelb-logo.png")
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
                <View style={styles.headerStyle}>
                    
                    <Text style={styles.headerTextStyle}> Unimelb Major List </Text>
                    <TextInput 
                        style={styles.headerSearchStyle} 
                        placeholder='Find your major'
                        onChangeText={(text) => this.onChangeText(text)}
                        value = {this.state.text}
                        /> 
                    
                    
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
                </View>

                <ScrollView>
                {
                    this.state.categories.map((item, value) => {
                        return (
                            <TouchableWithoutFeedback key={item.id} onPress={this.handleItemClick.bind(this, item.name)}>
                                <View key={item.id} style={[styles.item, {width: pictWidth}]}>
                                    <Image 
                                        source={item.imgUrl} 
                                        style={styles.itemImg}
                                    />
                                    <View style={styles.info}> 
                                        <Text style={styles.title}>Major ID: {item.id}</Text>
                                        <Text style={styles.desc}>{item.name}</Text>
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
        position: "absolute",
        marginBottom: 20
    },
    headerStyle: {
        height: '20%',
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
        borderRadius: 5,
        zIndex: 2
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
    item: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    itemImg: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 20,
        marginBottom: 10,
        width:80,
        height:80,
        zIndex:-1,
        borderRadius:12
    },
    info: {
        flex:1,
        display: 'flex',
        justifyContent: 'center',
        zIndex:-1
    },
    title: {
        lineHeight: 20,
        fontSize: 12,
        zIndex:-1
    },
    desc: {
        lineHeight: 20,
        fontSize: 16,
        zIndex:-1
    }
    
})