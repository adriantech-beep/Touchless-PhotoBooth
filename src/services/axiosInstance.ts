import { API_BASE_URL } from "@/config/env";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default axiosInstance;
