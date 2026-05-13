import { createContext, useState, useEffect,useContext } from 'react';
import {getUserProfile} from "../api/axios"
import {toast} from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async ()=>{
      
      // Check if token exists in local storage on load
      const token = localStorage.getItem('token');

      if(!token){
        setLoading(false);
        return;
      }

      try{
        const {data} = await getUserProfile();
        setUser(data.data);
        }catch(error){
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to fetch profile")
          localStorage.removeItem("token");
        }finally{
          setLoading(false);
        }
    }
    checkAuth();
  }, []);

  const login = function(userData,token){
    localStorage.setItem("token",token);
    localStorage.setItem("user",JSON.stringify(userData));
    setUser(userData);
  }
  const register = function(userData,token){
    localStorage.setItem("token",token);
    localStorage.setItem("user",JSON.stringify(userData));
    setUser(userData);
  }

  const logout = function(){
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  


  return (
    <AuthContext.Provider value={{ user, register,login,logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>{
  return useContext(AuthContext);
}
