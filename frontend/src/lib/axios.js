import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/v1"
    : "/api/v1";

console.log(BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
