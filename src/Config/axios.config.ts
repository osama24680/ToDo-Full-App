import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://mediumslateblue-grasshopper-147625.hostingersite.com/api",
  timeout: 10000,
});

export default axiosInstance;
