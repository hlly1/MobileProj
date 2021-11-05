import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import {styles} from "../../styles/style";
import {comps} from "../../styles/comp";
import { Text, Avatar } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import { NativeBaseProvider, Box, Center} from 'native-base';
import { LinearProgress } from 'react-native-elements';

class Home extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {majors:[], posts:[], loaded:0};
       
    }


    async getHotMajors(){
        await fetch("http://81.68.76.219:80/majorlist", 
            {method: 'GET', 
            headers:{'Accept': 'application/json', 'Content-Type': 'application/json'}}
            )
        .then(res => res.json())
        .then(resJson=>{
            if (resJson.status && resJson.data) {
                this.setState({
                    majors: resJson.data
                })
                this.setState({ loaded: 1 });
            }
        })
        .catch((err) => {alert('Home Majors: '+err)});
    }

    async getHotPosts(){
        await fetch("http://81.68.76.219:80/recent/postlist", 
            {method: 'GET', 
            headers:{'Accept': 'application/json', 'Content-Type': 'application/json'}}
            )
        .then(res => res.json())
        .then(resJson=>{
            if (resJson.status && resJson.data) {
                this.setState({
                    posts: resJson.data
                })
            }
            console.log(this.state.posts);
        })
        .catch((err) => {alert('Home Posts: '+err)});
    }

    toThisMajor(majorName){
        this.navigation.navigate('SubjectList', {majorName: majorName});
    }

    toPostDetails(id, code){
        console.log(id+"|"+code);
        this.navigation.navigate('PostDetails', {id: id, subject: code});
    }

    componentDidMount(){
        this.getHotMajors();
        this.getHotPosts();
    }

    componentDidUpdate(){
        // this.getHotMajors();
        // this.getHotPosts();
    }

    render(){

        return(
            this.state.loaded == 0 
            ? 
                <View style={{ marginTop: 400 }}>
                    <Text style={{textAlign:'center', fontSize: 15}}>Processing</Text>
                    <ActivityIndicator color="green" size={50} />
                    <LinearProgress color="primary" variant='indeterminate' number='1'/>
                    
                </View>
            : 
            
            <View style={styles.home_container}>
                <NativeBaseProvider>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.margin_bottom20}>
                        <View style={{alignItems:'center'}}>
                            <Text style={{color:'grey'}}> {Utils.currentDate()} </Text>
                            <Text h4 style={{ maxWidth: 250, overflow: 'scroll' }}>Postera crescam laude</Text>
                        </View>
                    </View>
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginBottom:20}}>MAJORS WITH MOST POSTS:</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.margin_bottom20}>
                    {
                        this.state.majors.map((item, value) => {
                            return (
                                <TouchableOpacity key={item.major_name} onPress={this.toThisMajor.bind(this, item.major_name)}>
                                    <Card
                                        title={''}
                                        image={{uri:item.imgUrl}}
                                        content={'Master of ' + item.major_name+'\nRelated Posts: '+item.book_count}
                                        Size="sm"
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                    <Text h5 style={{color:'grey', fontWeight:'bold'}}>RECENT POSTS(1 MONTHS):</Text>
                    <View>
                        {
                            this.state.posts.map((item, value) => {
                                let home_post_avatar = '';
                                if (item.icon_data == '') {
                                    home_post_avatar = require("../../assets/imgs/user-circle-1.png");
                                }else{
                                    home_post_avatar = {uri: 'data:image/jpeg;base64,' + item.icon_data};
                                }
                                return (
                                    <TouchableOpacity key={item.id} style={comps.post_card} onPress={this.toPostDetails.bind(this, item.id, item.subject_code)}>
                                        <View style={styles.post_box_column}>
                                            <View style={styles.post_box_row}>
                                                <Avatar
                                                    containerStyle={{ alignSelf: "center" }}
                                                    rounded
                                                    size="small"
                                                    source={home_post_avatar}
                                                >
                                                </Avatar>
                                                <Text style={{marginLeft:7,marginTop:6}}>{item.username}</Text>
                                            </View>

                                            <View style={{marginTop:7,marginBottom:7}}>
                                                <Text style={styles.post_title}>{item.topic}</Text>
                                            </View>
                                            
                                            <View>
                                                <Text style={{marginLeft:7,marginTop:6, textAlign:'right', color:'#7B7B7B', fontSize:12}}>{item.post_date}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }) 
                        }
                    </View>
                </ScrollView>
                </NativeBaseProvider>
            </View>
            
        )
    }

}

export default Home;