import axios from 'axios';

const URL = process.env.VUE_APP_API_URL;

const login = (user) => {
    return axios
        .post(URL + 'auth', {
            user: user.username,
            pwd: user.password 
        })
        .then((response) => {
            localStorage.setItem('token', response.data.accessToken)

            if(!JSON.parse(localStorage.getItem('tour'))){
                localStorage.setItem('tour', JSON.stringify({}))
            }
        })
}

const logout = () => {
    return axios
        .get(URL + 'logout')
        .then(() => {
            localStorage.removeItem('token')
        })
}

const refreshToken = () => {
    return axios
        .get(URL + `auth/${localStorage.token}`)
        .then((response) => {
            localStorage.setItem('token', response.data)
        })
}

export default {
    login,
    logout,
    refreshToken
}