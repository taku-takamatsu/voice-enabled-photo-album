import axios from 'axios';

// Create instance
export default axios.create({
    baseURL: `https://toin8u714e.execute-api.us-east-1.amazonaws.com/dev/`
});
