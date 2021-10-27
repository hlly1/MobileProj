import {Dimensions, StyleSheet} from "react-native"

const {width, height}=Dimensions.get("screen")

const styles = StyleSheet.create({

    //common use
    errorMsg:{
        color: 'red',
        fontSize: 12
    },
    post_box_column:{
        display:'flex',
        flexDirection:'column',
        justifyContent: 'flex-start',
    },
    post_box_row:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'flex-start',
    },        
    post_title:{
        color:"white", 
        marginLeft:5,
        fontSize:15, 
        fontWeight:'bold',
        overflow:'scroll'
    },
    post_title:{
        color:"white", 
        fontSize:15, 
        fontWeight:'bold',
        overflow:'scroll',
        marginBottom: 10
    },
    //-----------------------------------------------------------------login
    welcome: {
        fontSize: 25,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        marginTop: 60
    },

    linearGradient: {
        display: "flex",
        flex:1,
        justifyContent: "space-between",
        width: '100%'
    },

    image_container:{
        alignItems: "center"
    },

    pict:{
        height: 300,
        width: 200,
        alignItems: "center"
    },

    login_input:{
        borderStyle: 'solid',
        borderColor: '#D0D0D0',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 30,
        paddingLeft: 20,
        paddingRight: 20
    },

    login_pwd:{
        borderStyle: 'solid',
        borderColor: '#D0D0D0',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 15,
        paddingLeft: 20,
        paddingRight: 20
    },

    login_card:{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
    },

    login_button_adjust:{
        marginLeft: "10%",
        marginRight: "10%",
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        marginVertical: 24,
        height: 50,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },

    login_button:{
        fontSize: 15,
        color: '#ffffff',
        fontWeight:'bold'

    },

    options:{
        display:'flex',
        justifyContent:'space-between',
        flexDirection: 'row',
        marginBottom: 20
    },

    forgetPWD:{
        fontSize: 13,
        alignSelf:'flex-start',
    },

    signup:{
        fontSize: 13,
        alignSelf:'flex-end',
    },


    //----------------------------------------------------------------sign up

    signup_card:{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
    },

    pict2:{
        height: 200,
        width: 200,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30
    },

    //----------------------------------------------------------------home
    home_container:{
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        position:'absolute',
        paddingTop: '7%',
        paddingLeft: '7%',
        paddingRight: '7%',
        justifyContent:'flex-start'
    },

    //----------------------------------------------------------------profile

    profile_card:{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        height: height * 0.8
    },

    profile_title: {
        fontSize: 25,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        marginTop: 60,
        marginBottom: 30
    },

    margin_bottom20:{
        marginBottom: 20
    },

    margin_upbottom20: {
        marginBottom: 20,
        marginTop: 20
    },

    //----------------------------------------------------------------tabbar
    tabbar_container:{
        display: 'flex',
        flexDirection:'row', 
        backgroundColor:"#E8E8E8",
        paddingTop:5,
        justifyContent: 'space-between'
    },

    tabTextActived:{
        color: '#3E67D6',
        fontSize: 14,
        marginTop:"5%"
    },
    tabText: {
        color: '#8B8E95',
        fontSize: 14,
        marginTop:"5%"
    },

    //----------------------------------------------------------------

})

export {styles}