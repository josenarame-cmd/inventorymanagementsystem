import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
    code: string;
    symbol: string;
    rate: number; // Rate relative to USD (base)
};

const currencies: Record<string, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    RWF: { code: 'RWF', symbol: 'FRW', rate: 1280 }, // Example rate
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

type CurrencyContextType = {
    currency: Currency;
    setCurrency: (code: string) => void;
    format: (amount: number | undefined | null) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>(currencies.USD);

    useEffect(() => {
        const saved = localStorage.getItem('app_currency');
        if (saved && currencies[saved]) {
            setCurrencyState(currencies[saved]);
        }
    }, []);

    const setCurrency = (code: string) => {
        if (currencies[code]) {
            setCurrencyState(currencies[code]);
            localStorage.setItem('app_currency', code);
        }
    };

    const format = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null) return currency.symbol + '0.00';
        const converted = amount * currency.rate;
        return `${currency.symbol}${converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};
