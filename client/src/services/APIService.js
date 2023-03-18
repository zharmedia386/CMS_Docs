import authHeader from './AuthHeader'

export const API_URL = process.env.VUE_APP_API_URL;
export const HEADERS = authHeader();