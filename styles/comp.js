import {Dimensions, StyleSheet} from "react-native"
const comps = StyleSheet.create({

    card_container:{
        backgroundColor: 'white',
        width: 230,
        height: 180,
        borderRadius: 30,
        marginTop: 20,
        marginRight: 25,
        marginLeft: 10,
        marginBottom:35,
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

    des_large:{
        padding: 7, fontSize:17, alignContent:'center',fontWeight:'bold'
    },

    des_small:{
        padding: 7, fontSize:15, alignContent:'center',fontWeight:'bold'
    },
    
    post_card:{
        width: "100%",
        height: "auto",
        marginTop: 20,
        marginBottom:50,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        borderRadius: 12,
        backgroundColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },

    post_btn:{
        width:"100%",
        height:"100%",
    },

    
})
export {comps}