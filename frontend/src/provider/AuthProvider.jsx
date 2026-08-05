import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";


const AuthContext = createContext();


// 1. ADD THE 'export' KEYWORD HERE
export const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));


    // S26 RSA Logic: Decode the 'scope' claim to find ROLE_ADMIN
    const isAdmin = useMemo(() => {
        if (!token) return false;
        try {
            const payload = JSON.parse(window.atob(token.split('.')[1]));
            return payload.scope && payload.scope.includes("ROLE_ADMIN");
        } catch (e) { return false; }
    }, [token]);


    const setToken = (newToken) => {
        setToken_(newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    };


    const contextValue = useMemo(() => ({
        token,
        isAdmin,
        setToken,
        logout: () => setToken(null)
    }), [token, isAdmin]);


    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


// 2. KEEP THIS NAMED EXPORT AS WELL
export const useAuth = () => useContext(AuthContext);


// 3. REMOVE 'export default AuthProvider' from the bottom if it exists!
