
import { useAuth } from "../context/AuthContext"
import {Navigate} from "react-router-dom"
const PublicRoute = ({children}) =>{
    
    const {user,loading} = useAuth()

    if(loading){
        return (
            <div>
                loading...
            </div>
        )
    }

    if(user){
        return <Navigate to="/dashboard" replace />
    }
    return children;
}

export default PublicRoute