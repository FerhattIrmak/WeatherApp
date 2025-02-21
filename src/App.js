import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // CSS dosyasını import edin

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "2fe6f4836ce699f60779df8d4b6a599f"; // Buraya kendi API anahtarını ekle

  const getWeather = async () => {
    if (!city) return alert("Lütfen bir şehir adı girin!");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      alert("Şehir bulunamadı!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Hava Durumu Uygulaması</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Şehir adı girin..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && getWeather()}
          />
          <button onClick={getWeather} disabled={loading}>
            {loading ? "Yükleniyor..." : "Getir"}
          </button>
        </div>

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p className="temperature">{weather.main.temp}°C</p>
            <p className="description">{weather.weather[0].description}</p>
            <div className="details">
              <p>Nem: {weather.main.humidity}%</p>
              <p>Rüzgar: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;