import { User } from "@/types/User";
import { createContext, ReactNode, useEffect, useState } from "react";

export interface AppContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    const getUser = async () => {
        const res = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json()
        if (res.ok) {
            setUser(data)
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token])

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}
