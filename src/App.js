import React, { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const API_KEY = "2fe6f4836ce699f60779df8d4b6a599f"; // Buraya kendi API anahtarını ekle

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      alert("Şehir bulunamadı!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hava Durumu Uygulaması</h1>
      <input
        type="text"
        placeholder="Şehir adı girin..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Getir</button>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Sıcaklık: {weather.main.temp}°C</p>
          <p>Hava: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
