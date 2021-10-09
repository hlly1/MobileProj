import React, {Component} from "react";
import 'react-native-gesture-handler';
import { 
    View, 
    Image, 
    Text, 
    TouchableOpacity} from 'react-native';
import { styles } from "../styles/style.js";

// Reference:
// Icons are all from
// https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=35047

//DIY tabbar to make it easier
class Tabbar extends Component{
    constructor(props){
        super(props);
        this.state = {subjects: 0, profile: 0};
    }

    tabbar_jump_to(tabPressed) {
        if (tabPressed==='subjects') {
            this.setState({subjects:1, profile:0})
        } else if (tabPressed==='profile') {
            this.setState({subjects:0, profile:1})
        }
    }

    render(){
        return (
            <View style={styles.tabbar_container}>
                <TouchableOpacity onPress={()=>this.tabbar_jump_to('subjects')}>
                    {this.state.subjects == 1? 
                        <Image source={require('../assets/imgs/subjects-active.png')}/>: 
                        <Image source={require('../assets/imgs/subjects.png')}/>
                    }
                    <Text style={this.state.subjects == 1?styles.tabTextActived:styles.tabText}>Subjects</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.tabbar_jump_to('profile')}>
                    {this.state.profile == 1? 
                        <Image source={require('../assets/imgs/profile-active.png')}/>: 
                        <Image source={require('../assets/imgs/profile.png')}/>
                    }
                    <Text style={this.state.subjects == 1?styles.tabTextActived:styles.tabText}>Profile</Text>    
                </TouchableOpacity>
                
            </View>

        )
                    
    }
}
export default Tabbar;