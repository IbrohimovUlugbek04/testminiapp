import React, { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

  const debugLog = (message, isError = false) => {
    setLogs((prev) => [...prev, { message, isError }]);
  };

  useEffect(() => {
    try {
      if (typeof window.Telegram === "undefined" || !window.Telegram.WebApp) {
        debugLog("❌ Telegram.WebApp mavjud emas. Mini App faqat Telegram ichida ishlaydi!", true);
      } else {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const userData = tg.initDataUnsafe?.user;
        if (userData) {
          setUser(userData);
          debugLog("✅ Foydalanuvchi ma'lumotlari olindi.");
        } else {
          debugLog("⚠️ Foydalanuvchi ma'lumotlari mavjud emas!", true);
        }

        debugLog("Telegram WebApp obyektlari yuklandi.");
      }
    } catch (err) {
      debugLog("Xatolik: " + err.message, true);
    }
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Telegram Mini App Test</h1>
      <p>Quyida foydalanuvchi ma'lumotlari chiqadi:</p>
      <pre>{user ? JSON.stringify(user, null, 2) : "Ma'lumot yo'q"}</pre>

      <div
        style={{
          background: "#f5f5f5",
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px",
        }}
      >
        <h3>Debug log:</h3>
        {logs.map((log, index) => (
          <p key={index} style={{ color: log.isError ? "red" : "black" }}>
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
