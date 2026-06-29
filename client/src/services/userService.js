import api from './api';

/**
 * Connect a Telegram chat ID to the current user.
 * @param {string} telegramChatId
 */
export async function connectTelegram(telegramChatId) {
  const response = await api.patch('/users/connect-telegram', { telegramChatId });
  return response.data;
}

/**
 * Manually set the user's preferred city for weather alerts.
 * @param {string} city
 */
export async function updateCity(city) {
  const response = await api.patch('/users/city', { city });
  return response.data;
}

/**
 * Auto-detect city from browser geolocation coordinates.
 * @param {number} latitude
 * @param {number} longitude
 */
export async function detectCity(latitude, longitude) {
  const response = await api.patch('/users/detect-city', { latitude, longitude });
  return response.data;
}
