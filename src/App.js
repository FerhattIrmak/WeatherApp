import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "2fe6f4836ce699f60779df8d4b6a599f"; // Buraya kendi API anahtarını ekle

  const getWeather = async () => {
    if (!city) {
      setError("Lütfen bir şehir adı girin!");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Güncel hava durumu
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
      );
      
      if (!currentResponse.ok) {
        throw new Error("Şehir bulunamadı!");
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);
      
      // 5 günlük tahmin
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
      );
      
      if (!forecastResponse.ok) {
        throw new Error("Tahmin verileri alınamadı!");
      }
      
      const forecastData = await forecastResponse.json();
      
      // Günlük tahminleri gruplandır (Her gün için tek bir tahmin)
      const dailyForecasts = groupForecastsByDay(forecastData.list);
      setForecast(dailyForecasts);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tahminleri günlere göre gruplandırma
  const groupForecastsByDay = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString('tr-TR', { weekday: 'long' });
      
      if (!dailyData[day] || new Date(dailyData[day].dt * 1000).getHours() !== 12) {
        // Gündüz saati (12:00) tahminini tercih et, yoksa ilk tahmini al
        if (!dailyData[day] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyData[day].dt * 1000).getHours() - 12)) {
          dailyData[day] = forecast;
        }
      }
    });
    
    return Object.values(dailyData).slice(0, 5); // Sadece 5 gün döndür
  };

  // Hava durumu ikonunu al
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Tarih formatı
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
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
            {loading ? "Yükleniyor..." : "Ara"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {currentWeather && (
          <div className="current-weather">
            <h2>{currentWeather.name}, {currentWeather.sys.country}</h2>
            <div className="current-weather-details">
              <img 
                src={getWeatherIcon(currentWeather.weather[0].icon)} 
                alt={currentWeather.weather[0].description} 
                className="weather-icon"
              />
              <div className="current-temp-info">
                <div className="temperature">{Math.round(currentWeather.main.temp)}°C</div>
                <div className="feels-like">Hissedilen: {Math.round(currentWeather.main.feels_like)}°C</div>
              </div>
            </div>
            <div className="weather-description">{currentWeather.weather[0].description}</div>
            <div className="current-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-value">{currentWeather.main.humidity}%</span>
                <span className="detail-label">Nem</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-value">{currentWeather.wind.speed} m/s</span>
                <span className="detail-label">Rüzgar</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <span className="detail-value">{Math.round(currentWeather.main.pressure)} hPa</span>
                <span className="detail-label">Basınç</span>
              </div>
            </div>
          </div>
        )}

        {forecast && forecast.length > 0 && (
          <div className="forecast">
            <h3>5 Günlük Tahmin</h3>
            <div className="forecast-container">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <div className="forecast-date">{formatDate(day.dt)}</div>
                  <img 
                    src={getWeatherIcon(day.weather[0].icon)} 
                    alt={day.weather[0].description} 
                    className="forecast-icon"
                  />
                  <div className="forecast-temp">
                    <span className="max-temp">{Math.round(day.main.temp_max)}°</span>
                    <span className="min-temp">{Math.round(day.main.temp_min)}°</span>
                  </div>
                  <div className="forecast-desc">{day.weather[0].description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;