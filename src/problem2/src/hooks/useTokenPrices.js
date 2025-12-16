import { useState, useEffect } from 'react';

const PRICE_URL = 'https://interview.switcheo.com/prices.json';

export const useTokenPrices = () => {
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(PRICE_URL);
                if (!response.ok) throw new Error('Failed to fetch prices');
                const data = await response.json();

                // Process data to get latest price for each token
                // Structure: [{ currency: "BLUR", date: "2023-08-29T07:10:40.000Z", price: 0.20811525423728813 }]
                const priceMap = {};

                // Data might have duplicates, so we might want to handle that. 
                // Basic assumption: later entries in the list might be newer, or just overwrite.
                data.forEach(item => {
                    priceMap[item.currency] = item.price;
                });

                setPrices(priceMap);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    return { prices, loading, error };
};
