// apiClient.js

import { toast } from "react-toastify";

async function apiCall({ method = 'GET', url, token = '', body = null,UploadFile = false }) {
  const headers = {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    
  };
  if (!UploadFile) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body && method !== 'GET' && UploadFile!=true) {
    options.body = JSON.stringify(body);
  }else{
    options.body = body;
  }

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data.message || 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
      throw new Error(errorMessage);
      
    }else{
      toast.success(`Success: ${data.message || 'Operation completed successfully'}`);
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR] ${method} ${url}:`, error.message);
    throw error;
  }
}

// Exporting helper methods
export const apiClient = {
  get: (url, token = '') => apiCall({ method: 'GET', url, token }),
  post: (url, token = '', body = {},UploadFile) => apiCall({ method: 'POST', url, token, body ,UploadFile}),
  put: (url, token = '', body = {},UploadFile) => apiCall({ method: 'PUT', url, token, body ,UploadFile}),
  delete: (url, token = '') => apiCall({ method: 'DELETE', url, token }),
};