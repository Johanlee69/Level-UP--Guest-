import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
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
  getChatResponse: async (message, retryCount = 0) => {
    try {
      console.log('Sending AI request to:', `${API_URL}/chat/message`);
      const response = await api.post('/chat/message', { message });
      
      // Log the response for debugging
      console.log('AI response received:', response.data ? 'Data present' : 'No data');
      
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Implement retry logic (max 2 retries)
      if (retryCount < 2 && (error.code === 'ECONNABORTED' || !error.response)) {
        console.log(`Retrying AI request (attempt ${retryCount + 1})...`);
        return new Promise(resolve => {
          // Wait 1 second before retrying
          setTimeout(() => {
            resolve(chatService.getChatResponse(message, retryCount + 1));
          }, 1000);
        });
      }
      
      // If we get here, all retries failed or error wasn't retryable
      return {
        success: false,
        data: { 
          message: 'Failed to connect to AI service. Please try again later.' 
        },
        error: error.response?.data?.message || error.message || 'Failed to get AI response'
      };
    }
  }
};

export default api; 