import axios from 'axios'

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If error 401 - unauthorized - redirect to login
    if (error.response.status === 401) {
        localStorage.removeItem('token')
        this.$router.push({
            name: "login",
            params: {
              message: "Invalid session 2",
              status: true,
              msgtype: 'error'
            }
          })
    }
    return Promise.reject(error)
  }
)
