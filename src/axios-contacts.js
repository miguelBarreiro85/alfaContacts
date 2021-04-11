import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://contacts-9100c-default-rtdb.firebaseio.com/'
});

export default instance;