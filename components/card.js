import React, {Component} from "react";
import 'react-native-gesture-handler';
import { View, Image, Text } from 'react-native';
import {comps} from "../styles/comp.js";


const Card = props => {
    let card_size = comps.card_container;
    if (props.Size=="sm") {
        card_size = comps.card_container_sm;
    }
    return (
        <View style={card_size}>
            <View style={comps.card_content}>
                <Text h1 style={comps.card_title}>{props.title}</Text>
                <Image style={comps.backpict}
                source={props.image}
                />
            </View>
            <Text h4 style={{padding: 7}}>{props.content}</Text>
        </View>

    );
                
}
export default Card;