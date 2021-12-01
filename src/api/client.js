import axios from "axios";

const client = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  baseURL: "http://localhost:8080",
  timeout: 1000 * 60,
});

export default client;
