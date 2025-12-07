'use client';

import { useState, useEffect } from 'react';

type Messages = {
    [key: string]: any;
};

const messages: { [locale: string]: Messages } = {
    en: require('../messages/en.json'),
    es: require('../messages/es.json'),
    fr: require('../messages/fr.json'),
    de: require('../messages/de.json'),
};

export function useTranslations(namespace?: string) {
    const [locale, setLocale] = useState('en');
    const [currentMessages, setCurrentMessages] = useState(messages.en);

    useEffect(() => {
        // Load locale from cookie
        const savedLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('NEXT_LOCALE='))
            ?.split('=')[1] || 'en';

        setLocale(savedLocale);
        setCurrentMessages(messages[savedLocale] || messages.en);
    }, []);

    const t = (key: string, params?: Record<string, any>): string => {
        const keys = namespace ? `${namespace}.${key}`.split('.') : key.split('.');
        let value: any = currentMessages;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${namespace ? namespace + '.' : ''}${key}`);
                return key;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        // Simple parameter replacement
        if (params) {
            return value.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey] || '');
        }

        return value;
    };

    return t;
}

export function setLocale(newLocale: string) {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
    // Reload page to apply new locale
    window.location.reload();
}
