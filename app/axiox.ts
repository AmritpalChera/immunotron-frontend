import axios from "axios";

const backend  = axios.create({
    baseURL: 'http://localhost:5000'
});

export default backend;