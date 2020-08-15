import axios from "axios";
import resolve from './resolve';
require('dotenv').config()
let apiBaseUrl = process.env.URL || "http://localhost:8836/api"

export const getOS = async () => {
    return await resolve(axios.get(`${apiBaseUrl}/OS`)
        .then(res => res.data));
}
export const getData = async (params) => {
    return await resolve(axios.get(`${apiBaseUrl}/fetch?country=${params.country}&date=${params.date}&state=${params.state}`)
        .then(res => res.data));
}
export const insertData = async (body) => {
    return await resolve(axios.post(`${apiBaseUrl}/insert`, body)
        .then(res => res.data));
}
export const deleteData = async (id) => {
    return await resolve(axios.delete(`${apiBaseUrl}/delete/${id}`)
        .then(res => res.data));
}