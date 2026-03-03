"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TokenContextType {
    tokens: number;
    isAdmin: boolean;
    isTeacher: boolean;
    role: 'student' | 'teacher' | 'admin' | null;
    useTokens: (amount: number) => boolean;
    addTokens: (amount: number) => void;
    isLoading: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokens] = useState<number>(0);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isTeacher, setIsTeacher] = useState<boolean>(false);
    const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('user_role') as 'student' | 'teacher' | 'admin' | null;
        const token = localStorage.getItem('user_token');

        if (token && storedRole) {
            setRole(storedRole);
            if (storedRole === 'admin') {
                setIsAdmin(true);
                setIsTeacher(true);
                setTokens(Infinity);
            } else if (storedRole === 'teacher') {
                setIsAdmin(false);
                setIsTeacher(true);
                // Initial tokens for teachers (generous but finite)
                const storedTokens = localStorage.getItem('user_tokens');
                if (storedTokens) {
                    setTokens(parseInt(storedTokens));
                } else {
                    const initial = 2000;
                    setTokens(initial);
                    localStorage.setItem('user_tokens', initial.toString());
                }
            } else {
                setIsAdmin(false);
                setIsTeacher(false);
                // Initial tokens for demo
                const storedTokens = localStorage.getItem('user_tokens');
                if (storedTokens) {
                    setTokens(parseInt(storedTokens));
                } else {
                    const initial = 500;
                    setTokens(initial);
                    localStorage.setItem('user_tokens', initial.toString());
                }
            }
        }
        setIsLoading(false);
    }, []);

    const useTokens = (amount: number): boolean => {
        if (isAdmin) return true;
        if (tokens >= amount) {
            const remaining = tokens - amount;
            setTokens(remaining);
            localStorage.setItem('user_tokens', remaining.toString());
            return true;
        }
        return false;
    };

    const addTokens = (amount: number) => {
        if (isAdmin) return;
        const total = tokens + amount;
        setTokens(total);
        localStorage.setItem('user_tokens', total.toString());
    };

    return (
        <TokenContext.Provider value={{ tokens, isAdmin, isTeacher, role, useTokens, addTokens, isLoading }}>
            {children}
        </TokenContext.Provider>
    );
}

export function useTokens() {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useTokens must be used within a TokenProvider');
    }
    return context;
}
