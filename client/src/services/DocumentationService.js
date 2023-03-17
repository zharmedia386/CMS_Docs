import { API_URL, HEADERS } from './APIService';
import axios from 'axios';

const URL = API_URL + 'documentations/'

const updateMetadata = (metadata) => axios({ method: 'put', url: URL + 'metadata', data: metadata, headers: HEADERS })

export default {
    updateMetadata
}