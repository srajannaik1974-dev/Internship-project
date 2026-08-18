import axios from 'axios';
import { initialMockProfile, initialMockFoodDiary, sampleFoodAnalysis, initialDailyInsight } from '../data/mockData';

// API Configuration using Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Axios Request Interceptor to attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for Mock Fallback Storage in LocalStorage during Standalone Dev
const getLocalData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`nutrimind_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    return fallback;
  }
};

const setLocalData = (key, value) => {
  try {
    localStorage.setItem(`nutrimind_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
};

// Initialize Mock Fallback Data if needed
if (!localStorage.getItem('nutrimind_profile')) {
  setLocalData('profile', initialMockProfile);
}
if (!localStorage.getItem('nutrimind_food')) {
  setLocalData('food', initialMockFoodDiary);
}

/**
 * AUTHENTICATION API
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    return null;
  }
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  const userObj = response.data?.data || response.data?.user || { name: userData.name, email: userData.email };
  localStorage.setItem('user', JSON.stringify(userObj));
  localStorage.removeItem('nutrimind_profile');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  const userObj = response.data?.data || response.data?.user;
  if (userObj) {
    localStorage.setItem('user', JSON.stringify(userObj));
  }
  localStorage.removeItem('nutrimind_profile');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  if (response.data?.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

/**
 * PROFILE API
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    const data = response.data?.data || response.data;
    setLocalData('profile', data);
    return data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for /profile, using fallback mock data.');
    const local = getLocalData('profile', initialMockProfile);
    const storedUser = getStoredUser();
    if (storedUser?.name) {
      local.name = storedUser.name;
    }
    return local;
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await apiClient.post('/profile', profileData);
    const data = response.data?.data || response.data;
    setLocalData('profile', data);
    return data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for POST /profile, saving locally.');
    setLocalData('profile', profileData);
    return profileData;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/profile', profileData);
    const updated = response.data?.data || response.data;
    setLocalData('profile', updated);
    if (profileData.name) {
      const stored = getStoredUser() || {};
      stored.name = profileData.name;
      localStorage.setItem('user', JSON.stringify(stored));
    }
    return updated;
  } catch (error) {
    console.log('[API Service] Backend unavailable for PUT /profile, updating locally.');
    setLocalData('profile', profileData);
    if (profileData.name) {
      const stored = getStoredUser() || {};
      stored.name = profileData.name;
      localStorage.setItem('user', JSON.stringify(stored));
    }
    return profileData;
  }
};


/**
 * FOOD DIARY API
 */
export const createFoodEntry = async (foodData) => {
  try {
    const response = await apiClient.post('/food', foodData);
    return response.data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for POST /food, adding locally.');
    const current = getLocalData('food', initialMockFoodDiary);
    const newEntry = {
      id: `food_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      ...foodData
    };
    const updated = [newEntry, ...current];
    setLocalData('food', updated);
    return newEntry;
  }
};

export const getFoodHistory = async () => {
  try {
    const response = await apiClient.get('/food');
    return response.data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for GET /food, using local history.');
    return getLocalData('food', initialMockFoodDiary);
  }
};

export const getTodaysFood = async () => {
  try {
    const response = await apiClient.get('/food/today');
    return response.data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for GET /food/today, filtering local history.');
    const all = getLocalData('food', initialMockFoodDiary);
    const todayStr = new Date().toISOString().split('T')[0];
    return all.filter(item => item.date === todayStr);
  }
};

export const getFoodEntry = async (id) => {
  try {
    const response = await apiClient.get(`/food/${id}`);
    return response.data;
  } catch (error) {
    const all = getLocalData('food', initialMockFoodDiary);
    return all.find(item => item.id === id) || null;
  }
};

export const updateFoodEntry = async (id, data) => {
  try {
    const response = await apiClient.put(`/food/${id}`, data);
    return response.data;
  } catch (error) {
    const all = getLocalData('food', initialMockFoodDiary);
    const updated = all.map(item => item.id === id ? { ...item, ...data } : item);
    setLocalData('food', updated);
    return data;
  }
};

export const deleteFoodEntry = async (id) => {
  try {
    const response = await apiClient.delete(`/food/${id}`);
    return response.data;
  } catch (error) {
    const all = getLocalData('food', initialMockFoodDiary);
    const filtered = all.filter(item => item.id !== id);
    setLocalData('food', filtered);
    return { success: true, id };
  }
};

/**
 * FOOD ANALYSIS API (Multipart / Form Data)
 */
export const analyzeFood = async (formData) => {
  try {
    // If input is not already FormData, convert it or send directly
    let body = formData;
    let config = {};

    if (formData instanceof FormData) {
      config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
    }

    const response = await apiClient.post('/analyze', body, config);
    return response.data;
  } catch (error) {
    console.log('[API Service] Backend unavailable for POST /analyze-food, generating mock analysis.');
    
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    let foodDesc = 'Food item';
    if (formData instanceof FormData) {
      foodDesc = formData.get('food_description') || formData.get('food_name') || 'Food item';
    } else if (typeof formData === 'object') {
      foodDesc = formData.food_description || formData.food_name || 'Food item';
    }

    const descLower = foodDesc.toLowerCase();
    let result = sampleFoodAnalysis.Default;

    if (descLower.includes('samosa')) {
      result = sampleFoodAnalysis.Samosa;
    } else {
      result = {
        food_name: foodDesc,
        wellness_level: descLower.includes('salad') || descLower.includes('fruit') || descLower.includes('idli') ? 'Low Concern' : 'Moderate Concern',
        analysis: `Analysis for "${foodDesc}": Contains carbohydrates and essential dietary components.`,
        suggestion: 'Balance this meal with fresh vegetables and adequate hydration.',
        estimated_nutrition: {
          calories: 280,
          protein: "8g",
          carbs: "38g",
          fats: "9g",
          fiber: "3g"
        }
      };
    }

    return result;
  }
};

/**
 * DAILY INSIGHT API
 */
export const getDailyInsight = async () => {
  try {
    const response = await apiClient.get('/insight');
    return response.data;
  } catch (error) {
    return initialDailyInsight;
  }
};

// Aliases for page compatibility
export const getFoods = getFoodHistory;
export const deleteFood = deleteFoodEntry;
export const createFood = createFoodEntry;

