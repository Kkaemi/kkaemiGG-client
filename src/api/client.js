import axios from "axios";
import { API_BASE_URL } from "../constant";

export const kkaemiGGApi = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
  baseURL: `${API_BASE_URL}/api`,
  timeout: 1000 * 60,
});
