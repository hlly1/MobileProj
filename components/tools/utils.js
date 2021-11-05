import AsyncStorage from "@react-native-async-storage/async-storage";
export default {

    currentDate() {
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        return year+'/'+month+'/'+day;
    },
    async storeData(sessionEmail){
        try {
            await AsyncStorage.setItem('sessionEmail', sessionEmail);
            console.log(sessionEmail);
        }catch (e) {
            console.error(e);
            alert(e);
        }
    },
    async getSessionEmail(){
        try {
            return await AsyncStorage.getItem('sessionEmail');
        }catch (err) {
            console.error(err);
            return null;
        }
    }
}