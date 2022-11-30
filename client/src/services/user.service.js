import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3500/';

class UserService {
  getDocs() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getCms() {
    return axios.get(API_URL + 'cms/metadata', { headers: authHeader() });
  }
}

export default new UserService();
