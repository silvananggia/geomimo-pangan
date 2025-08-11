import axios from "../api/axios";
import authHeader from "./auth-header";


const register = (username, email, password) => { 
    return axios.post("/register", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios.post("/login", {
        username,
        password,
    });
};



const checkAuth = (id) => {
    return axios.get(`/get-user/${id}`, { headers: authHeader() });
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return axios.post("/logout", {}, { headers: authHeader() });
    
};

const authService = {
    register,
    login,
    logout,
    checkAuth,
  };
  
  export default authService;