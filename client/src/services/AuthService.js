import { API_URL } from './APIService';
import axios from 'axios';

const login = (user) => {
    return axios
        .post(API_URL + 'auth', {
            user: user.username,
            pwd: user.password 
        })
        .then((response) => {
            localStorage.setItem('token', response.data.accessToken)
        })
}

const logout = () => {
    return axios
        .get(API_URL + 'logout')
        .then(() => {
            localStorage.removeItem('token')
        })
}

const refreshToken = () => {
    return axios
        .get(API_URL + `auth/${localStorage.token}`)
        .then((response) => {
            localStorage.setItem('token', response.data)
        })
}

export default {
    login,
    logout,
    refreshToken
}