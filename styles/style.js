import {Dimensions, StyleSheet} from "react-native"

const {width, height}=Dimensions.get("window");
// const {win_width, win_height}=Dimensions.get("window");
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
        marginLeft:5,
        fontSize:15, 
        fontWeight:'bold',
        overflow:'scroll',
        textAlign: 'center',
    },
    postlist_empty:{
        fontSize: 17,
        fontWeight: "bold",
        alignSelf:'center',
        marginTop: height * 0.1,
        color:"#8A8A8A"
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
        width: '100%',
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
        height: height
    },

    profile_title: {
        fontSize: 25,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent',
        marginTop: 60,
        marginBottom: 30,
        marginLeft: 10,
        marginRight:10
    },

    margin_bottom20:{
        marginBottom: 20
    },

    margin_upbottom20: {
        marginBottom: 20,
        marginTop: 20
    },

    //----------------------------------------------------------------newpost
    postlist_card:{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 30,
        height: height,
    },
    add_post:{ 
        position: "absolute", 
        alignSelf: "flex-end", 
        bottom: 0, opacity:0.6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        marginBottom:20,
        right: 15,
    },
    container: {
        paddingTop: 20
    },
    text: {
        textAlign: "center",
    },
    wrapperCustom: {
        borderRadius: 8,
        padding: 6,
        borderColor: "grey",
        borderWidth: 1,
        width: width*0.6
    },
    post_submit_button_adjust:{
        marginLeft: "10%",
        marginRight: "10%",
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
    profile_card_post:{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 30
    },
    inputContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    clickContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10,
        alignSelf: "center"
    },
    txtBorder: {
        height: 50,
        width: 400,
        flex: 1,
        borderWidth: 1,
        borderColor: '#51A7F9',
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 25,
        flexDirection: 'row'
    },
    txtName: {
        height: 20,
        marginLeft: 20,
        fontSize: 15,
        marginTop: 15,
        color: '#51A7F9',
        marginRight: 10,
        fontSize: 14
    },
    textInput: {
        height: 50,
        width: 200
    },
    inputBoxContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    txtBorder_inputBox: {
        height: 200,
        width: 400,
        flex: 1,
        borderWidth: 1,
        borderColor: '#51A7F9',
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 25,
        flexDirection: 'column'
    },
    txtBorder_Box: {
        width: 400,
        flex: 1,
        borderWidth: 1,
        borderColor: '#51A7F9',
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 25,
        flexDirection: 'column',
        paddingBottom: 20
    },
    txtName_Box: {
        marginLeft: 20,
        fontSize: 15,
        marginTop: 15,
        color: '#51A7F9',
        marginRight: 10,
        fontSize: 14
    }

})

export {styles}