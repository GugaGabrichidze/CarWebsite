import React, { useMemo, useCallback, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const Select = React.memo(({
                               label,
                               value,
                               onChange,
                               options,
                               disabled = false,
                               defaultOption = "ყველა",
                               isMultiSelect = false
                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState(
        isMultiSelect ? (Array.isArray(value) ? value : []) : value
    );

    // Update selectedItems when value changes from outside
    useEffect(() => {
        if (isMultiSelect) {
            setSelectedItems(Array.isArray(value) ? value : []);
        }
    }, [value, isMultiSelect]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.custom-select')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const filteredOptions = options && options.length > 0
        ? options.filter(option =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleCheckboxChange = (optionId) => {
        let newSelectedItems;
        if (Array.isArray(selectedItems)) {
            newSelectedItems = selectedItems.includes(optionId)
                ? selectedItems.filter(id => id !== optionId)
                : [...selectedItems, optionId];
            setSelectedItems(newSelectedItems);
            onChange({ target: { value: newSelectedItems } });
        }
    };

    if (isMultiSelect) {
        return (
            <div className="select-container">
                <label>{label}</label>
                <div className="custom-select">
                    <div
                        className={`select-header ${disabled ? 'disabled' : ''}`}
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                    >
                        <span>
                            {Array.isArray(selectedItems) && selectedItems.length > 0
                                ? `არჩეულია ${selectedItems.length}`
                                : defaultOption}
                        </span>
                        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
                    </div>

                    {isOpen && !disabled && (
                        <div className="select-dropdown">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="ძებნა..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="options-container">
                                {filteredOptions.map((option) => (
                                    <label key={option.id} className="option-item">
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(selectedItems) &&
                                                selectedItems.includes(option.id)}
                                            onChange={() => handleCheckboxChange(option.id)}
                                        />
                                        <span>{option.name}</span>
                                    </label>
                                ))}
                                {filteredOptions.length === 0 && (
                                    <div className="no-results">შედეგები არ მოიძებნა</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="select-container">
            <label>{label}</label>
            <div className="custom-select">
                <div
                    className={`select-header ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span>
                        {value ? options.find(opt => opt.id === value)?.name || defaultOption : defaultOption}
                    </span>
                    <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && !disabled && (
                    <div className="select-dropdown">
                        <div className="options-container">
                            {/* Add "All" option at the top */}
                            <label className="option-item">
                                <input
                                    type="radio"
                                    checked={!value}
                                    onChange={() => {
                                        onChange({ target: { value: "" } });
                                        setIsOpen(false);
                                    }}
                                />
                                <span>{defaultOption}</span>
                            </label>

                            {options.map((option) => (
                                <label key={option.id} className="option-item">
                                    <input
                                        type="radio"
                                        checked={value === option.id}
                                        onChange={() => {
                                            onChange({ target: { value: option.id } });
                                            setIsOpen(false);
                                        }}
                                    />
                                    <span>{option.name}</span>
                                </label>
                            ))}

                            {options.length === 0 && (
                                <div className="no-results">შედეგები არ მოიძებნა</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

const PriceRangeInput = React.memo(({
                                        value,
                                        onChange,
                                        placeholder,
                                        className,
                                        currency
                                    }) => (
    <input
        type="number"
        className={className}
        value={value}
        onChange={onChange}
        placeholder={`${placeholder} ${currency === 'GEL' ? '₾' : '$'}`}
        min="0"
    />
));

const Filters = ({
                     saleType,
                     setSaleType,
                     selectedManufacturer,
                     setSelectedManufacturer,
                     manufacturers,
                     category,
                     setCategory,
                     categories,
                     models,
                     selectedModel,
                     setSelectedModel,
                     minPrice,
                     setMinPrice,
                     maxPrice,
                     setMaxPrice,
                     currency,
                     setCurrency
                 }) => {

    const [filteredModels, setFilteredModels] = useState([]);

    const categoryModelMapping = {
        "1": "სედანი",
        "2": "კუპე",
        "3": "ჯიპი",
        "4": "უნივერსალი",
    };

    // განახლებული useEffect მოდელების ფილტრაციისთვის
    // განახლებული useEffect მოდელების ფილტრაციისთვის
    useEffect(() => {
        const filterModelsByCategory = () => {
            console.log("მოდელები:", models); // დავამატოთ ლოგი დებაგისთვის

            // თუ მოდელების მასივი ცარიელია, დავაბრუნოთ ცარიელი მასივი
            if (!models || models.length === 0) {
                console.log("მოდელები არ არის");
                setFilteredModels([]);
                return;
            }

            // ყველა მოდელის ასლი
            let filtered = [...models];
            console.log("ფილტრაციამდე:", filtered.length);

            // კატეგორიით ფილტრაცია, თუ არჩეულია
            if (category) {
                filtered = filtered.filter(model => {
                    const categoryMatch = model.category_id &&
                        String(model.category_id) === String(category);
                    return categoryMatch;
                });
                console.log("კატეგორიის შემდეგ:", filtered.length);
            }

            // მწარმოებლით ფილტრაცია, თუ არჩეულია
            if (selectedManufacturer && selectedManufacturer.length > 0) {
                filtered = filtered.filter(model => {
                    return selectedManufacturer.includes(String(model.manufacturer_id));
                });
                console.log("მწარმოებლის შემდეგ:", filtered.length);
            }

            // ფორმატირება UI-სთვის
            const formattedModels = filtered.map(model => ({
                id: model.model_id,
                name: model.model_name,
                manufacturer_id: model.manufacturer_id
            }));

            console.log("საბოლოო მოდელები:", formattedModels.length);
            setFilteredModels(formattedModels);
        };

        filterModelsByCategory();
    }, [models, category, selectedManufacturer]);


    const saleTypeOptions = useMemo(() => [
        {id: "1", name: "იყიდება"},
        {id: "2", name: "ქირავდება"}
    ], []);

    const manufacturerOptions = useMemo(() =>
            manufacturers.map(brand => ({
                id: brand.man_id,
                name: brand.man_name
            })),
        [manufacturers]
    );

    const categoryOptions = useMemo(() =>
            Array.isArray(categories) ? categories.map(cat => ({
                id: cat.category_id,
                name: categoryModelMapping[cat.category_id] || cat.title
            })) : [],
        [categories]
    );

    const handleSaleTypeChange = useCallback((e) => {
        setSaleType(e.target.value);
    }, [setSaleType]);

    const handleManufacturerChange = useCallback((e) => {
        const newManufacturers = e.target.value;
        setSelectedManufacturer(newManufacturers);

        // გავასუფთაოთ არჩეული მოდელი როცა მწარმოებელი იცვლება
        setSelectedModel("");
    }, [setSelectedManufacturer, setSelectedModel]);



    const handleCategoryChange = useCallback((e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        setSelectedModel("");
    }, [setCategory, setSelectedModel]);

    const handleModelChange = useCallback((e) => {
        setSelectedModel(e.target.value);
    }, [setSelectedModel]);

    const handleMinPriceChange = useCallback((e) => {
        const value = e.target.value;
        if (value === '' || parseInt(value) >= 0) {
            setMinPrice(value);
        }
    }, [setMinPrice]);

    const handleMaxPriceChange = useCallback((e) => {
        const value = e.target.value;
        if (value === '' || parseInt(value) >= 0) {
            setMaxPrice(value);
        }
    }, [setMaxPrice]);

    const handleCurrencyChange = useCallback(() => {
        const newCurrency = currency === 'GEL' ? 'USD' : 'GEL';
        const exchangeRate = 2.65;

        let newMinPrice = minPrice;
        let newMaxPrice = maxPrice;

        if (newCurrency === 'USD') {
            newMinPrice = (Number(minPrice) / exchangeRate).toFixed(0);
            newMaxPrice = (Number(maxPrice) / exchangeRate).toFixed(0);
        } else {
            newMinPrice = (Number(minPrice) * exchangeRate).toFixed(0);
            newMaxPrice = (Number(maxPrice) * exchangeRate).toFixed(0);
        }

        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        setCurrency(newCurrency);
    }, [currency, minPrice, maxPrice, setCurrency, setMinPrice, setMaxPrice]);

    return (
        <div className="properties">
            <Select
                label="გარიგების ტიპი"
                className="sale-type"
                value={saleType}
                onChange={handleSaleTypeChange}
                options={saleTypeOptions}
                defaultOption="აირჩიეთ გარიგების ტიპი"
            />

            <Select
                label="მწარმოებელი"
                className="model"
                value={selectedManufacturer}
                onChange={handleManufacturerChange}
                options={manufacturerOptions}
                defaultOption="ყველა მწარმოებელი"
                isMultiSelect={true}
            />

            <Select
                label="კატეგორია"
                className="category"
                value={category}
                onChange={handleCategoryChange}
                options={categoryOptions}
                defaultOption="ყველა კატეგორია"
            />

            <Select
                label="მოდელი"
                className="models"
                value={selectedModel}
                onChange={handleModelChange}
                options={filteredModels}
                disabled={false}
                defaultOption="ყველა მოდელი"
            />

            <div className="price-range">
                <div className="price-header">
                    <label>ფასი</label>
                    <button
                        className="currency-toggle-btn"
                        onClick={handleCurrencyChange}
                    >
                        {currency === 'GEL' ? '₾' : '$'}
                    </button>
                </div>
                <div className="price-inputs">
                    <PriceRangeInput
                        className="price-input"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        placeholder="დან"
                        currency={currency}
                    />
                    <span className="price-separator">-</span>
                    <PriceRangeInput
                        className="price-input"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        placeholder="მდე"
                        currency={currency}
                    />
                </div>
            </div>
        </div>
    );
};

Filters.propTypes = {
    saleType: PropTypes.string.isRequired,
    setSaleType: PropTypes.func.isRequired,
    selectedManufacturer: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelectedManufacturer: PropTypes.func.isRequired,
    manufacturers: PropTypes.arrayOf(
        PropTypes.shape({
            man_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            man_name: PropTypes.string.isRequired,
        })
    ).isRequired,
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    models: PropTypes.arrayOf(
        PropTypes.shape({
            model_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            model_name: PropTypes.string.isRequired,
            manufacturer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    selectedModel: PropTypes.string.isRequired,
    setSelectedModel: PropTypes.func.isRequired,
    minPrice: PropTypes.string,
    setMinPrice: PropTypes.func.isRequired,
    maxPrice: PropTypes.string,
    setMaxPrice: PropTypes.func.isRequired,
    currency: PropTypes.oneOf(['GEL', 'USD']).isRequired,
    setCurrency: PropTypes.func.isRequired,
};

Select.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    className: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    defaultOption: PropTypes.string,
    isMultiSelect: PropTypes.bool
};

PriceRangeInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    currency: PropTypes.oneOf(['GEL', 'USD']).isRequired,
};

export default React.memo(Filters);