import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
} from "react-native";
import {styles} from "../../styles/style";
import {comps} from "../../styles/comp";
import { Text } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider, Box, Center, Avatar} from 'native-base';
import { TouchableOpacity } from "react-native-gesture-handler";
class Home extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {majors:[], posts:[]};
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
            }
        })
        .catch((err) => {alert('Home Majors: '+err)});
    }

    async getHotPosts(){
        await fetch("http://81.68.76.219:80/xxx", 
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
        })
        .catch((err) => {alert('Home Posts: '+err)});
    }

    toThisMajor(majorName){
        this.navigation.navigate('SubjectList', {majorName: majorName})
    }

    componentDidMount(){
        this.getHotMajors();
        // this.getHotPosts();
    }

    componentDidUpdate(){
        // this.getHotMajors();
        // this.getHotPosts();
    }

    render(){

        // let posts = [];
        // for (let i = 0; i < 10; i++) {
        //     posts.push(
        //         <TouchableOpacity key={i} style={comps.post_card} onPress={() => this.toPostDetails(this.state.postlist[i].id)}>
        //             <View style={styles.post_box_column}>
        //                 <View style={styles.post_box_row}>
        //                     <Avatar
        //                         containerStyle={{ alignSelf: "center" }}
        //                         rounded
        //                         size="small"
        //                         source={avatar_data}
        //                     >
        //                     </Avatar>
        //                     <Text style={{marginLeft:7,marginTop:6}}>{this.state.postlist[i].username}</Text>
        //                 </View>

        //                 <View style={{marginTop:7,marginBottom:7}}>
        //                     <Text style={styles.post_title}>{this.state.postlist[i].topic}</Text>
        //                 </View>
                        
        //                 <View>
        //                     <Text style={{marginLeft:7,marginTop:6, textAlign:'right', color:'#7B7B7B', fontSize:12}}>{this.state.postlist[i].post_date}</Text>
        //                 </View>
        //             </View>
        //         </TouchableOpacity>
        //     )
        // }

        return(
            
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
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginBottom:20}}>RECENT POSTS(2 MONTHS):</Text>
                    <View>
                        {/* {posts} */}
                    </View>
                </ScrollView>
                </NativeBaseProvider>
            </View>
            
        )
    }

}

export default Home;