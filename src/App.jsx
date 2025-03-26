import { useState, useEffect } from "react";
import "./App.css";
import SideBar from "./components/SideBar.jsx";
import Main from "./components/Main.jsx";
import { fetchManufacturers, fetchCategories, fetchCarListings, fetchModelsForManufacturers } from "./components/api.jsx";

function App() {
    const [manufacturers, setManufacturers] = useState([]);
    const [vehicleType, setVehicleType] = useState("car");
    const [saleType, setSaleType] = useState("");
    const [selectedManufacturer, setSelectedManufacturer] = useState([]);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [currency, setCurrency] = useState("GEL");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    // ფავორიტების სახელმწიფო
    const [favorites, setFavorites] = useState([]);
    // აქტიური ტაბის სახელმწიფო (ძებნა ან ფავორიტები)
    const [activeTab, setActiveTab] = useState("search");

    // ფავორიტების ჩატვირთვა localStorage-დან
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (error) {
                console.error("Error loading favorites from localStorage:", error);
                setFavorites([]);
            }
        }
    }, []);

    // ფავორიტების შენახვა localStorage-ში როცა ისინი იცვლება
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // მწარმოებლებისა და კატეგორიების ჩატვირთვა
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [manufacturersData, categoriesData] = await Promise.all([
                    fetchManufacturers(),
                    fetchCategories()
                ]);
                setManufacturers(manufacturersData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error loading initial data:", error);
            }
        };
        loadInitialData();
    }, []);

    // მოდელების ჩატვირთვა როცა მწარმოებელი იცვლება
    useEffect(() => {
        const loadModelsForSelectedManufacturers = async () => {
            if (selectedManufacturer && selectedManufacturer.length > 0) {
                try {
                    // ჩატვირთვა მხოლოდ არჩეული მწარმოებლების მოდელების
                    const manufacturerModels = await fetchModelsForManufacturers(selectedManufacturer);
                    console.log("ჩატვირთულია მოდელები არჩეული მწარმოებლებისთვის:", manufacturerModels.length);

                    setModels(manufacturerModels);
                } catch (error) {
                    console.error("მოდელების ჩატვირთვის შეცდომა:", error);
                    setModels([]);
                }
            } else {
                // თუ მწარმოებელი არ არის არჩეული, გავასუფთაოთ მოდელები
                setModels([]);
            }
        };

        loadModelsForSelectedManufacturers();
    }, [selectedManufacturer]);

    // Filter manufacturers based on vehicle type
    const filteredManufacturers = manufacturers.filter((brand) => {
        if (vehicleType === "car") return brand.is_car === "1";
        if (vehicleType === "tractor") return brand.is_spec === "1";
        if (vehicleType === "moto") return brand.is_moto === "1";
        return true;
    });

    const filteredCategories = categories.filter((cat) => {
        let value = cat.category_type;
        if (vehicleType === "car") return value === 0;
        if (vehicleType === "tractor") return value === 1;
        if (vehicleType === "moto") return value === 2;
        return false;
    });

    const handleSearch = async () => {
        setIsSearched(true);
        setActiveTab("search"); // ძებნის ტაბზე გადასვლა
        window.location.hash = 'search';
        try {
            const carListings = await fetchCarListings();

            const results = carListings.filter(car => {
                // მწარმოებლების შემოწმება - თუ არჩეულია ერთი ან მეტი მწარმოებელი
                const manufacturerMatch = selectedManufacturer.length === 0 ||
                    selectedManufacturer.includes(String(car.man_id));

                const modelMatch = !selectedModel ||
                    String(car.model_id) === String(selectedModel);

                const categoryMatch = !category ||
                    String(car.category_id) === String(category);

                const priceMatch = (!minPrice || car.price >= Number(minPrice)) &&
                    (!maxPrice || car.price <= Number(maxPrice));

                const saleTypeMatch = !saleType ||
                    String(car.for_rent) === (saleType === "2" ? "1" : "0");

                return manufacturerMatch && modelMatch &&
                    categoryMatch && priceMatch && saleTypeMatch;
            });

            setSearchResults(results);
        } catch (error) {
            console.error("Error during search:", error);
            setSearchResults([]);
        }
    };

    // ფავორიტებში დამატება/წაშლის ფუნქცია
    const toggleFavorite = (car) => {
        setFavorites(prevFavorites => {
            // შევამოწმოთ არის თუ არა მანქანა უკვე ფავორიტებში
            const isAlreadyFavorite = prevFavorites.some(fav => fav.car_id === car.car_id);

            if (isAlreadyFavorite) {
                // თუ უკვე ფავორიტებშია, წავშალოთ
                return prevFavorites.filter(fav => fav.car_id !== car.car_id);
            } else {
                // თუ არ არის ფავორიტებში, დავამატოთ
                return [...prevFavorites, car];
            }
        });
    };

    // შევამოწმოთ არის თუ არა მანქანა ფავორიტებში
    const isFavorite = (carId) => {
        return favorites.some(fav => fav.car_id === carId);
    };

    // ფავორიტების ტაბზე გადასვლა


    // ძებნის ტაბზე გადასვლა


    return (
        <div className="app-container">
            <SideBar
                setVehicleType={setVehicleType}
                saleType={saleType}
                setSaleType={setSaleType}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={setSelectedManufacturer}
                category={category}
                setCategory={setCategory}
                manufacturers={filteredManufacturers}
                categories={filteredCategories}
                models={models}
                setModels={setModels}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                currency={currency}
                setCurrency={setCurrency}
                onSearch={handleSearch}
            />
            <Main
                selectedManufacturer={selectedManufacturer}
                selectedModel={selectedModel}
                category={category}
                searchResults={activeTab === "search" ? searchResults : favorites}
                isSearched={isSearched}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                activeTab={activeTab}
            />
        </div>
    );
}

export default App;