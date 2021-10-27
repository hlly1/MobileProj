import {Dimensions, StyleSheet} from "react-native"
const comps = StyleSheet.create({

    card_container:{
        backgroundColor: 'white',
        width: 300,
        height: 260,
        borderRadius: 30,
        marginTop: 20,
        marginRight: 25,
        marginLeft: 10,
        marginBottom:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7
    },

    backpict:{
        width: '100%',
        height:'100%',
        position:'absolute',
        top: 0,
        left: 0,
        zIndex: -1
    },
    
    card_title:{
        color:'white',
        padding: 20,
        fontSize: 25,
        fontWeight:'bold'
    },

    card_content:{
        width: '100%',
        height: "100%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow:'hidden'

    },  

    card_container_sm:{
        backgroundColor: 'white',
        width: 150,
        height: 110,
        borderRadius: 30,
        // marginTop: 10,
        marginRight: 25,
        marginLeft: 10,
        marginBottom: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7
    },
    
})
export {comps}