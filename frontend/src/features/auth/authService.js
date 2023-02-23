// Service is used for http requests, retreiving the data

import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/";
// const API_URL =
//   "https://operation-tracker-backend-3yvuhaorjq-uc.a.run.app/api/";

// axios.defaults.withCredentials = true;

// Login User
const login = async (userData) => {
  try {
    const { data } = await axios.post(API_URL + "login", userData);
    if (data.username) {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.log("error from AuthService: ", error);
    toast.error("Invalid Credentials");
    return error;
  }
};

//logout CHANGE THIS TO HTTP ONLY COOKIE
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  login,
  logout,
};

export default authService;
