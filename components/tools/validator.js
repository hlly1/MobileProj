export default {

    email_validate(email) {
        const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return email_regex.test(email);
    },

    name_validate(name) {
        if (name.length == 0){
            return false;
        }else{
            return true;
        }
    },
}