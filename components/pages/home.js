import React, {Component} from "react";
import 'react-native-gesture-handler';
import {View, 
    ScrollView,
} from "react-native";
import {styles} from "../../styles/style";
import { Text } from 'react-native-elements';
import Utils from '../tools/utils.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider, Box, Center} from 'native-base';
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
                        This is a Sample Post
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
                            <Text h4 style={{ maxWidth: 250, overflow: 'scroll', textAlign:'center'}}>We shall grow in the esteem of future generations</Text>
                        </View>
                    </View>
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