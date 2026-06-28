import api from './api';

/**
 * Connect a Telegram chat ID to the current user.
 * @param {string} telegramChatId
 */
export async function connectTelegram(telegramChatId) {
  const response = await api.patch('/users/connect-telegram', { telegramChatId });
  return response.data;
}
