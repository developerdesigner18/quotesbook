import React, { useContext, useState, useEffect } from 'react'
import { projectAuth } from './firebase/config'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const authProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState();

    const signup = ( email, password ) => {
        projectAuth.createUserWithEmainAndPassword(email, password)
    }

    useEffect(() => {
        const unsubscribe = projectAuth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

