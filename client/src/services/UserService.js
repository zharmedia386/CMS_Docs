import axios from 'axios';

const URL = process.env.VUE_APP_API_URL;

const register = (user) => axios({ method: 'post', url: URL + 'register', data:user })

export default {
    register
}