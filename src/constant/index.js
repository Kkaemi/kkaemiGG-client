// api
const BACKEND_PORT = `:${process.env.VUE_APP_BACKEND_PORT}`;
export const API_BASE_URL = `${location.protocol}//${location.hostname}${BACKEND_PORT}`;

// client redirect uri
const FRONTEND_PORT = `:${process.env.VUE_APP_FRONTEND_PORT}`;
export const REDIRECT_URI = `${location.protocol}//${location.hostname}${FRONTEND_PORT}/oauth2/redirect`;
