
import React, { useEffect, useState } from 'react';

function CarList({ selectedManufacturer }) {
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        fetch('https://static.my.ge/myauto/js/mans.json')
            .then(response => response.json())
            .then(data => {
                if (selectedManufacturer) {
                    const filtered = data.filter(m => m.man_id === selectedManufacturer);
                    setManufacturers(filtered);
                } else {
                    setManufacturers(data);
                }
            })
            .catch(error => console.error('Error:', error));
    }, [selectedManufacturer]);

    return (
        <div className="cars-grid">
            {manufacturers.map((manufacturer) => (
                <div key={manufacturer.man_id} className="car-card">
                    <div className="car-info">
                        <h3 className="car-title">{manufacturer.man_name}</h3>
                        <div className="car-models">
                            {manufacturer.models?.map(model => (
                                <div key={model.model_id} className="model-info">
                                    <span className="model-name">{model.model_name}</span>
                                    <span className="model-year">
                    {model.model_years?.join('-')}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CarList;