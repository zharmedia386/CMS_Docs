import { API_URL, HEADERS } from './APIService';
import axios from 'axios';

const URL = API_URL + 'documentations/'

const getDocumentations = () => axios({ method: 'get', url: URL })
const getAllVersions = () => axios({ method: 'get', url: URL + 'version' })
const getMetadata = () => axios({ method: 'get', url: URL + 'metadata' })
const updateMetadata = (metadata) => axios({ method: 'put', url: URL + 'metadata', data: metadata, headers: HEADERS })

export default {
    getDocumentations,
    getAllVersions,
    getMetadata,
    updateMetadata
}