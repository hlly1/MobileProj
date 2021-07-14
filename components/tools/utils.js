export default {

    currentDate() {
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        return year+'/'+month+'/'+day;
    }

}