import axios from 'axios';
import Cookies from 'js-cookie';

const URL_API = process.env.URL_API || 'http://localhost:8088/api';

const axiosInstance = axios.create();

const token =localStorage.getItem('authToken');
if (token) {
  // Thiết lập token vào header của request
  axiosInstance.defaults.headers.common.Authorization = token;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => 
    // Handle request errors here

     Promise.reject(error)
  
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => 
    // Modify the response data here (e.g., parse, transform)

     response
  ,
  (error) => 
    // Handle response errors here

     Promise.reject(error)
  
);
const sendRequest = async (method, url, data = null) => {
  try {
    const response = await axiosInstance.request({
      method,
      url: URL_API + url,
      data
    });
    return response?.data;
  } catch (error) {
    console.log('error', error?.response?.data);
    return error?.response?.data;
  }
};

export { sendRequest };
