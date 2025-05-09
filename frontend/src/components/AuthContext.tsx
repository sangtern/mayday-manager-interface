import { useState, useContext, createContext, PropsWithChildren } from 'react';
import User from '../interfaces/User';

export interface AuthInterface {
    user?: User | undefined;
    setUser: Function;
    isLoggedIn: boolean;
    setLoggedIn: Function;
};

const AuthContext = createContext<AuthInterface>({
    user: undefined,
    setUser: () => {},
    isLoggedIn: false,
    setLoggedIn: () => {}
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [ user, setUser ] = useState<User | undefined>(undefined);
    const [ isLoggedIn, setLoggedIn ] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setLoggedIn }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

/*import { createContext, useContext, PropsWithChildren, useState } from 'react';
import User from '../interfaces/User';

export interface AuthInterface {
    user?: User | null;
    setUser?: Function | null;
};

const AuthContext = createContext<AuthInterface>({ user: null, setUser: null });

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [ user, setUser ] = useState<User>({
        email: "",
        name: "",
        role: "user"
    });

    return (
        <AuthContext.Provider value={{ user: user, setUser: setUser }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}; */
