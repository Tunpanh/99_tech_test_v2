import React, { useState, useEffect, useMemo } from 'react';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { ArrowDownUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import './SwapForm.css';

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

const TokenIcon = ({ currency }) => {
    const [error, setError] = useState(false);

    // Reset error when currency changes
    useEffect(() => {
        setError(false);
    }, [currency]);

    if (!currency) return <div className="token-icon-placeholder" />;

    const src = `${ICON_BASE_URL}${currency}.svg`;

    if (error) {
        // Fallback or simple initial
        return (
            <div className="token-icon" style={{ background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                {currency[0]}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={currency}
            className="token-icon"
            onError={() => setError(true)}
        />
    );
};

export const SwapForm = () => {
    const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices();

    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('ETH');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const currencies = useMemo(() => {
        return Object.keys(prices).sort();
    }, [prices]);

    // Set initial currencies once loaded
    useEffect(() => {
        if (currencies.length > 0) {
            // Default to first two available if current selection invalid
            if (!prices[fromCurrency]) setFromCurrency(currencies[0]);
            if (!prices[toCurrency]) setToCurrency(currencies.find(c => c !== currencies[0]) || currencies[1]);
        }
    }, [currencies, prices]); // Only run when list populates

    const exchangeRate = useMemo(() => {
        if (!prices[fromCurrency] || !prices[toCurrency]) return 0;
        return prices[fromCurrency] / prices[toCurrency];
    }, [prices, fromCurrency, toCurrency]);

    const outputAmount = useMemo(() => {
        const val = parseFloat(amount);
        if (isNaN(val) || val < 0) return '';
        return (val * exchangeRate).toFixed(6); // 6 decimal places for tokens
    }, [amount, exchangeRate]);

    const handleSwapDirection = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            // Reset status after 3 seconds
            setTimeout(() => setSubmitStatus(null), 3000);
        }, 1500);
    };

    const isValidAmount = !amount || (parseFloat(amount) > 0);

    if (pricesLoading) {
        return (
            <div className="swap-container" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ borderColor: '#4f46e5', borderTopColor: 'transparent', margin: '0 auto' }}></div>
                <p style={{ marginTop: 16 }}>Loading prices...</p>
            </div>
        );
    }

    if (pricesError) {
        return (
            <div className="swap-container">
                <div style={{ color: 'red', textAlign: 'center' }}>
                    <AlertCircle style={{ marginBottom: 8 }} />
                    <p>Failed to load prices. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="swap-container">
            <div className="form-header">
                <h2>Swap Assets</h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* From Input */}
                <div className="input-group">
                    <label className="input-label">You pay</label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setSubmitStatus(null);
                            }}
                            placeholder="0.00"
                            className="currency-input"
                            step="any"
                        />
                        <div className="currency-select-wrapper">
                            <TokenIcon currency={fromCurrency} />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="currency-select"
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {!isValidAmount && (
                        <div className="error-msg">Please enter a valid amount</div>
                    )}
                </div>

                {/* Swap Direction */}
                <div className="swap-direction">
                    <button type="button" className="swap-btn" onClick={handleSwapDirection} aria-label="Swap currencies">
                        <ArrowDownUp size={20} />
                    </button>
                </div>

                {/* To Input */}
                <div className="input-group">
                    <label className="input-label">You receive</label>
                    <div className="input-wrapper" style={{ background: '#f9fafb' }}>
                        <input
                            type="text"
                            value={outputAmount}
                            readOnly
                            placeholder="0.00"
                            className="currency-input"
                            style={{ color: '#6b7280' }}
                        />
                        <div className="currency-select-wrapper">
                            <TokenIcon currency={toCurrency} />
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="currency-select"
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="exchange-info">
                    <span>Rate</span>
                    <span>1 {fromCurrency} = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}</span>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={!amount || !isValidAmount || isSubmitting}
                    style={submitStatus === 'success' ? { background: '#10b981' } : {}}
                >
                    {isSubmitting ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            <div className="spinner"></div> Processing...
                        </div>
                    ) : submitStatus === 'success' ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
                            <CheckCircle2 size={20} /> Swap Confirmed
                        </div>
                    ) : (
                        "Confirm Swap"
                    )}
                </button>
            </form>
        </div>
    );
};
