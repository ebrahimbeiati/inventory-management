import { config } from '../config';

export interface User {
  userId: string;
  email: string;
  role: string;
  status: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request to ${url}. Attempts remaining: ${retries - 1}`);
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export const setAuthCookies = async (accessToken: string, idToken: string, refreshToken?: string): Promise<void> => {
  try {
    const response = await fetchWithRetry(`${config.api.baseUrl}/auth/set-cookies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ accessToken, idToken, refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to set auth cookies');
    }
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    throw error;
  }
};

export const clearAuthCookies = async (): Promise<void> => {
  try {
    const response = await fetchWithRetry(`${config.api.baseUrl}/auth/clear-cookies`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to clear auth cookies');
    }
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const response = await fetchWithRetry(`${config.api.baseUrl}/auth/user`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const verifyAuth = async (): Promise<User | null> => {
  try {
    const response = await fetchWithRetry(`${config.api.baseUrl}/auth/verify`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
}; 