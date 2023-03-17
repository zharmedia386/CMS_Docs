import { API_URL, HEADERS } from './APIService';
import axios from 'axios';

const URL = API_URL + 'chapters/'

const getAllChapters = () => axios({ method: 'get', url: URL })
const createChapter = (chapter) => axios({ method: 'post', url: URL, data:chapter, headers: HEADERS })
const updateChapter = (chapter) => axios({ method: 'put', url: URL, data:chapter, headers: HEADERS })
const deleteChapter = (chapter) => axios({ method: 'delete', url: URL, data:chapter, headers: HEADERS })

export default {
    getAllChapters,
    createChapter,
    updateChapter,
    deleteChapter
}