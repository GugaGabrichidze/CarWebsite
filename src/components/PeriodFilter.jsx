
import React, { useState, useRef, useEffect } from 'react';

const PeriodFilter = ({ onPeriodChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const periodOptions = [
        { id: '1h', name: '1 საათი', value: 1 },
        { id: '3h', name: '3 საათი', value: 3 },
        { id: '6h', name: '6 საათი', value: 6 },
        { id: '12h', name: '12 საათი', value: 12 },
        { id: '24h', name: '24 საათი', value: 24 },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePeriodSelect = (hours) => {
        onPeriodChange(hours);
        setIsOpen(false);
    };

    return (
        <div className="period-dropdown" ref={dropdownRef}>
            <button
                className="period-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>პერიოდი</span>
                <svg
                    className={`period-icon ${isOpen ? 'open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 11L3 6h10l-5 5z" fill="currentColor"/>
                </svg>
            </button>

            {isOpen && (
                <div className="period-options">
                    {periodOptions.map((option) => (
                        <button
                            key={option.id}
                            className="period-option"
                            onClick={() => handlePeriodSelect(option.value)}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PeriodFilter;