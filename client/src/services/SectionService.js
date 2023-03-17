import { API_URL, HEADERS } from './APIService';
import axios from 'axios';

const URL = API_URL + 'sections/'

const getAllSections = () => axios({ method: 'get', url: URL })
const getSectionById = (id) => axios({ method: 'get', url: URL + `/${id}` })
const createSection = (section) => axios({ method: 'post', url: URL, data:section, headers: HEADERS })
const updateSection = (section) => axios({ method: 'put', url: URL, data:section, headers: HEADERS })
const deleteSection = (id) => axios({ method: 'delete', url: URL, data:id, headers: HEADERS })

export default {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
}