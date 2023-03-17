import { API_URL, HEADERS } from './APIService';
import axios from 'axios';

const URL = API_URL + 'versioning/'

const createVersion = (versionName) => axios({ method: 'put', url: URL + 'create', data:versionName, headers: HEADERS })
const editVersion = (payload) => axios({ method: 'put', url: URL + 'edit', data:payload, headers: HEADERS })
const deleteVersion = (payload) => axios({ method: 'put', url: URL + 'delete', data:payload, headers: HEADERS })
const addChapter = (payload) => axios({ method: 'put', url: URL + 'chapter', data:payload, headers: HEADERS })
const removeChapter = (payload) => axios({ method: 'put', url: URL + 'chapter/delete', data:payload, headers: HEADERS })
const addSection = (payload) => axios({ method: 'put', url: URL + 'section', data:payload, headers: HEADERS })
const removeSection = (payload) => axios({ method: 'put', url: URL + 'section/delete', data:payload, headers: HEADERS })
const reorderContent = (content) => axios({ method: 'put', url: URL + 'reorder', data:content, headers: HEADERS })

export default {
    createVersion,
    editVersion,
    deleteVersion,
    addChapter,
    removeChapter,
    addSection,
    removeSection,
    reorderContent
}