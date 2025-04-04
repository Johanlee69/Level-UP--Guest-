import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors 
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response);
    } 
    else if (error.request) {
      console.error("API Network Error: No response from server", error.request);
    } 
    else {
      console.error("API Request Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// The only API service needed - Gemini API
export const chatService = {
  getChatResponse: async (message) => {
    try {
      const response = await api.post('/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      return Promise.reject(new Error(error.response?.data?.message || 'Failed to get AI response'));
    }
  }
};

export default api; 