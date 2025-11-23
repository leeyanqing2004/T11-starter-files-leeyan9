import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: get the BACKEND_URL.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // TODO: Modify me.

    useEffect(() => {
        // TODO: complete me, by retriving token from localStorage and make an api call to GET /user/me.

        // when the user is logged in (i.e., localStorage contains a valid token), 
        //      fetch the user data from /user/me,
        //      and update the user context state with the returned user object.

        // when the user is not logged in (i.e., localStorage does not contain a token), 
        //      set the user context state to null.

        // first, we get the token from localStorage
        const fetchUser = async() => {
            const token = localStorage.getItem("token");

            if (!token) {
                // set user context state to null
                setUser(null);
            } 
            else {
                const response = await fetch(`${BACKEND_URL}/user/me`, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${token}`
                    }
                })

                const data = await response.json();
                const user = data.user;
                setUser(user);

            }
        };
        fetchUser();

    }, [])

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        // TODO: complete me

        try {
            // YQ: using the username and password, we fetch the token
            const response = await fetch (`${BACKEND_URL}/login`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: `${username}`,
                    password: `${password}`,
                })
            })

            const data = await response.json();

            if (!response.ok) {
                return data.message || "Login failed"
            }

            const token = data.token;
            
            localStorage.setItem("token", token);

            navigate("/profile");
            return null;
        } catch (err) {
            return "Network error"
        }
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        // TODO: complete me

        try {
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: userData.username,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    password: userData.password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                return data.message || "Error occured"
            }

            navigate("/success");
            return null;

        } catch (err) {
            return "Network error";
        }
        //return "TODO: complete me";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
