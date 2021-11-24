import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 1000 * 60,
});

export default client;
