import axios from 'axios'
const api = axios.create({
    baseURL:'https://prevgaurd.onrender.com/',
    timeout: 10000,
})

export default api
