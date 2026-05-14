import { createContext, useState, useEffect,useContext } from 'react';
import {getUserProfile, logoutUser} from "../api/axios"
import {toast} from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try{
        const {data} = await getUserProfile();
        setUser(data.data);
        }catch(error){
          console.error(error);
          // Only show error toast if it's not a 401 (Unauthorized)
          if (error.response?.status !== 401) {
            toast.error(error.response?.data?.message || "Failed to fetch profile");
          }
        }finally{
          setLoading(false);
        }
    }
    checkAuth();
  }, []);

  

  return (
    <AuthContext.Provider value={{ user,setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>{
  return useContext(AuthContext);
}
