/**
 * Get initials from a name string.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date string into a human-readable format.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract error message from an Axios error response.
 * @param {Error} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return error?.message || 'Something went wrong';
}

/**
 * Extract token from URL query params (after OAuth redirect).
 * @returns {string|null}
 */
export function extractTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}
