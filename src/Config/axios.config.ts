import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://mediumslateblue-grasshopper-147625.hostingersite.com/api",
  timeout: 10000,
});

// Expired or invalid token: clear the stored user and send them back to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("loggedInUser")) {
      localStorage.removeItem("loggedInUser");
      location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
