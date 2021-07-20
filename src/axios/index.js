import axios from "axios";

const instance = axios.create({
    baseURL: 'http://128.199.106.220:8002/user'
})

export default instance
