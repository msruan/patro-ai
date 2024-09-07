import axios from "axios";
const baseURL = process.env.API_URl;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
