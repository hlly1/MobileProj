import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
} from "react-native";
import {styles} from "../../styles/style";
import { Text } from 'react-native-elements';
import Utils from '../tools/utils.js';
import Card from '../card';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider, Box, Center, Avatar} from 'native-base';
class Home extends Component{
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {username: "", icondata: ""};
    }


    render(){

        let posts = [];
        for (let i = 0; i < 10; i++) {
            posts.push(
                <View key = {i} style={styles.margin_bottom20}>
                    <Box
                        bg='violet.800'
                        p="12"
                        rounded="xl"
                        _text={{
                            fontSize: 'md',
                            fontWeight: 'bold',
                            color: 'warmGray.50',
                            textAlign: 'center',
                        }}
                        >
                            <View style={styles.post_box_column}>
                                <View style={{alignItems:'center'}}>
                                    <Text style={styles.post_title}>COMP900xx Sample Major Name</Text>
                                </View>
                                <View style={styles.post_box_row}>
                                    <Avatar
                                        alignSelf="center"
                                        size="sm"
                                        source={require("../../assets/imgs/user-circle-2.png")}
                                    >
                                    </Avatar>
                                    <Text style={{color:"white", marginLeft:7,marginTop:5,fontSize:15}}>Username:</Text>
                                </View>

                                <View style={{marginTop:7}}>
                                    <Text style={styles.post_title}>This is a title of this post and this is very long asda asfaf gdasga dfafs adsadasd sedgvsf </Text>
                                </View>
                                
                            </View>
                    </Box>
                </View>
            )
        }

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
                        <Card
                            title={''}
                            image={require('../../assets/imgs/unimelb-logo.png')}
                            content={'descriptions'}
                            Size="sm"
                        />
                        <Card
                            title={''}
                            image={require('../../assets/imgs/unimelb-logo.png')}
                            content={'descriptions'}
                            Size="sm"
                        />
                        <Card
                            title={''}
                            image={require('../../assets/imgs/unimelb-logo.png')}
                            content={'descriptions'}
                            Size="sm"
                        />
                        <Card
                            title={''}
                            image={require('../../assets/imgs/unimelb-logo.png')}
                            content={'descriptions'}
                            Size="sm"
                        />
                    </ScrollView>
                    <Text h5 style={{color:'grey', fontWeight:'bold', marginBottom:20}}>RECENT POSTS:</Text>
                    <View>
                        {posts}
                    </View>
                </ScrollView>
                </NativeBaseProvider>
            </View>
            
        )
    }

}

export default Home;