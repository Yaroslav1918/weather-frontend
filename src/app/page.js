"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://weather-api-hdfv.onrender.com";

function App() {
  const [city, setCity] = useState("");
  const [citySubscribed, setCitySubscribed] = useState("");
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState(null);
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("subscriptionToken");
    const isSubscribed = localStorage.getItem("isSubscribed") === "true";
    setToken(token);
    setIsSubscribed(isSubscribed);
  }, []);
  const getWeather = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      setMessage("City not found or error fetching weather.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    setLoading
    try {
      const res = await axios.post(`${BASE_URL}/api/subscribe`, {
        email,
        city: citySubscribed,
        frequency,
      });
      setMessage(res.data.message);
      setCitySubscribed("");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading
    try {
      const res = await axios.get(`${BASE_URL}/api/unsubscribe/${token}`);
      setMessage(res.data.message);
      localStorage.setItem("isSubscribed", "false");
      localStorage.removeItem("subscriptionToken");
      setToken("");
      setIsSubscribed(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Unsubscription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: "##fff5d7" }}
      className="min-h-screen  p-6 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-4">🌤️ Weather App</h1>

      <div className="bg-white shadow p-6 rounded w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Check Weather</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setMessage("");
            setWeather(null);
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          onClick={getWeather}
        >
          Get Weather
        </button>
        {weather && (
          <div className="mt-4 text-gray-800">
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>📋 Condition: {weather.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow p-6 rounded w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Subscribe</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Enter city"
          value={citySubscribed}
          onChange={(e) => setCitySubscribed(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-2"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          onClick={subscribe}
        >
          Subscribe
        </button>
      </div>

      <div className="bg-white shadow p-6 rounded w-full max-w-md mb-4">
        <button
          className={`px-4 py-2 w-full rounded text-white 
    ${
      !isSubscribed
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-red-500 hover:bg-red-600"
    }`}
          onClick={unsubscribe}
          disabled={!isSubscribed}
        >
          Unsubscribe
        </button>
      </div>

      {message && (
        <div className="text-center text-lg text-purple-700 font-large mt-2">
          {message}
        </div>
      )}
      {loading && (
        <div className="text-center text-lg text-blue-500 font-medium mt-2">
          Loading...
        </div>
      )}
    </div>
  );
}

export default App;
