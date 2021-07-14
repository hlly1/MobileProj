export default {

    email_validate(email) {
        const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        return email_regex.test(email);
    },

}