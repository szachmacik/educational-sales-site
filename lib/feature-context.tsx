"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type FeatureFlags = {
    [key: string]: boolean | string | number | any[];
};

interface FeatureContextType {
    features: FeatureFlags;
    isLoaded: boolean;
    getFlag: (key: string, defaultValue?: any) => any;
    setFlag: (key: string, value: any) => void;
    toggleFlag: (key: string) => void;
    exportConfig: () => string;
    importConfig: (json: string) => boolean;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: React.ReactNode }) {
    const [features, setFeatures] = useState<FeatureFlags>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const load = () => {
            const loadedFeatures: FeatureFlags = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    if (value !== null) {
                        try {
                            loadedFeatures[key] = JSON.parse(value);
                        } catch {
                            loadedFeatures[key] = value === 'true' ? true : value === 'false' ? false : value;
                        }
                    }
                }
            }
            setFeatures(loadedFeatures);
        };

        load();
        setIsLoaded(true);

        const handleStorage = (e: StorageEvent) => {
            load();
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const getFlag = (key: string, defaultValue: any = false) => {
        return features[key] ?? defaultValue;
    };

    const setFlag = (key: string, value: any) => {
        const updated = { ...features, [key]: value };
        setFeatures(updated);
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    };

    const toggleFlag = (key: string) => {
        const newVal = !features[key];
        setFlag(key, newVal);
    };

    const exportConfig = () => {
        return JSON.stringify(features, null, 2);
    };

    const importConfig = (json: string) => {
        try {
            const config = JSON.parse(json);
            setFeatures(config);
            Object.entries(config).forEach(([key, val]) => {
                localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
            });
            return true;
        } catch (e) {
            console.error("Failed to import config", e);
            return false;
        }
    };

    return (
        <FeatureContext.Provider value={{ features, isLoaded, getFlag, setFlag, toggleFlag, exportConfig, importConfig }}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatures() {
    const context = useContext(FeatureContext);
    if (context === undefined) {
        throw new Error('useFeatures must be used within a FeatureProvider');
    }
    return context;
}
