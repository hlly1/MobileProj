import React, { Component } from "react";
import 'react-native-gesture-handler';
import {
    View,
    TextInput,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class CourseList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            new_categories: [],
            text: '',
            originList: [],
            list: [],
            major_name: this.props.route.params.majorName,
            loaded:0
        }
        this.handleGetListSucc = this.handleGetListSucc.bind(this)
    }

    getSession = async (element) => {
        try {
            return await AsyncStorage.getItem(element);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getSubjectList(){
        let sessionEmail = await this.getSession('sessionEmail');
        try {
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch (err) {

        }

        var majorData = JSON.stringify({
            "email": sessionEmail,
            "major_name": this.state.major_name,
        })
        fetch("http://81.68.76.219:80/subjectlist",
            {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: majorData
            }
        )
            .then(res => res.json())
            .then(this.handleGetListSucc)
            // .then(this.handleGetListSucc)
            .catch(() => { alert('请求异常') })
    }

    async subjectSubscribeUpdate(item) {
        var subject_code = item["subject_code"];
        var subjectSubscribeUpdateURL = 'http://81.68.76.219:80/unsubscribe';
        if (item["is_subscribed"] == -1) {
            subjectSubscribeUpdateURL = 'http://81.68.76.219:80/subscribe';
        }

        let sessionEmail = await this.getSession('sessionEmail');
        try {
            // to solve an unknown format bug in different developing environment
            sessionEmail = JSON.parse(sessionEmail);
        }
        catch (err) {

        }

        var subjectSubscribeUpdateData = JSON.stringify({
            "email": sessionEmail,
            "subject_code": subject_code,
        });
        console.log(subjectSubscribeUpdateData);
        const res = await fetch(subjectSubscribeUpdateURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: subjectSubscribeUpdateData
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson["status"] == 1) {
                    if (item["is_subscribed"] == -1) {
                        alert("Subject Subscribe Successfully!");
                    }
                    else {
                        alert("Subject Unsubscribe Successfully!");
                    }
                    this.props.navigation.navigate('SubjectList', {});
                } else if (responseJson["status"] == -1) {
                    alert("Failed to update subject subscribe. Please try later!");
                } else {
                    alert("Issue-[xxx]: Please contact admin!");
                }
            })
            .catch((error) => {
                alert("Issue-[xxx]:" + error);
            });

    }

    componentDidMount() {
        // alert("提取有关 major:" + this.props.route.params.subject + "的相关帖子")
        this.getSubjectList();
    }

    componentDidUpdate(nextProps){
        if(nextProps != this.props){
            this.getSubjectList();
        }
    }

    handleGetListSucc(res) {
        if (res.status && res.data) {
            this.setState({
                categories: res.data
            })
            this.setState({ loaded: 1 });
        }
    }

    handleItemClick(subject_code, subject_name) {
        // const {navigate} = this.props.navigation;
        // navigate('MajorList', {courseId: courseId})
        this.props.navigation.navigate('PostList', {subject: subject_code, subject_name:subject_name})
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
                return v["subject_major"].toLowerCase().includes(text.toLowerCase()) | v["subject_code"].toLowerCase().includes(text.toLowerCase()) | v["subject_name"].toLowerCase().includes(text.toLowerCase())
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
            this.state.loaded == 0 
            ? 
                <View style={{ marginTop: 400 }}>
                  
                    <ActivityIndicator color="blue" size={50} />
                    <Text style={{textAlign:'center'}}>Loading</Text>
                </View>
            : 
            <View style={styles.container}>
                <LinearGradient colors={['#9b63cd', '#e0708c']} style={styles.headerStyle}>
                    <View style={styles.headerSearchStyle}>
                        <Image source={require("../../assets/imgs/search.png")} style={styles.headerSearchIcon}/>
                        <TextInput 
                        style={styles.headerInputText}
                        placeholder='Find your subject'
                        onChangeText={(text) => this.onChangeText(text)}
                        value = {this.state.text}
                        /> 

                    </View>
                    
                    <FlatList style={styles.searchItem}
                        data={this.state.list}
                        keyExtractor={(item) => item["subject_code"]}
                        renderItem={({item}) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.handleItemClick.bind(this, item["subject_code"])}>
                                    <View style={{paddingTop:8}}>
                                        <Text>{item["subject_name"]}</Text>
                                    </View>
                                </TouchableWithoutFeedback >
                                
                            )
                        }
                    }/>
                </LinearGradient>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                
                    <View style={styles.list}>
                        {
                            this.state.categories.length != 0 ?
                            this.state.categories.map((item) => {
                                return (
                                    <TouchableWithoutFeedback key={item.subject_code} onPress={this.handleItemClick.bind(this, item["subject_code"], item["subject_name"])}>
                                        <View style={[styles.cardStyle, {width: pictWidth}]}> 
                                        {/* source={{uri: item.imgUrl}} */}
                                            <Image source={{uri: item.imgUrl}} style={[{width: pictWidth, height: pictWidth-2*textHeight}, styles.cardImage]}/>
                                            <View style={{ flexDirection: "row" }}>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={styles.itemCode}>{item["subject_code"]}</Text>
                                                    <Text style={styles.itemName}>{item["subject_name"]}</Text>
                                                </View>
                                                {item["is_subscribed"] == '1'
                                                    ?
                                                    <View style={{ flex: 1, marginTop: 8 }}>
                                                        <Icon size={30} name="star" color="orange" onPress={() => { this.subjectSubscribeUpdate(item) }} />
                                                    </View>
                                                    :
                                                    <View style={{ flex: 1, marginTop: 8 }}>
                                                        <Icon size={30} name="star" color="grey" onPress={() => { this.subjectSubscribeUpdate(item) }} />
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            }):
                            <View>
                                <Text style={styles.postlist_empty}>This major has not been added any courses!</Text>
                            </View>
                            
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
        backgroundColor: '#fff',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 2,
        paddingLeft: 15

    },
    content: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5,
        zIndex:-1,

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
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10, 
        borderRadius: 30,
        zIndex:-1
    },
    cardImage: {
        zIndex: -1, 
        borderTopLeftRadius:30, 
        borderTopRightRadius:30,
    },
    itemCode: {
        textAlign: 'center',
        
        height: 15,
        lineHeight: 15,
        zIndex:-1,
        fontSize:10
    },
    itemName: {
        textAlign: 'center',
        height: 35,
        lineHeight: 35,
        zIndex:-1,
        fontSize:10
    }
    
})

