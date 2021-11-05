import React from "react";
import 'react-native-gesture-handler';
import { View, Image, Text } from 'react-native';
import {comps} from "../styles/comp.js";


const Card = props => {
    let card_size = comps.card_container;
    let des_size = comps.des_large;
    if (props.Size=="sm") {
        card_size = comps.card_container_sm;
        des_size = comps.des_small;
    }
    return (
        <View style={card_size}>
            <View style={comps.card_content}>
                <View style={{ height: "70%" }}>
                    <Text h1 style={comps.card_title}>{props.title}</Text>
                    <Image style={comps.backpict}
                        source={props.image}
                    />
                </View>
                <View style={{ marginLeft: 10, marginTop: -5 }}>
                    <Text h4 style={des_size}>{props.content}</Text>
                </View>
            </View>
        </View>

    );
                
}
export default Card;