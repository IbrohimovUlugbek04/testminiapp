import React, { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

  const debugLog = (message, isError = false) => {
    setLogs((prev) => [...prev, { message, isError }]);
  };

  useEffect(() => {
    try {
      if (typeof window.Telegram === "undefined" || !window.Telegram.WebApp) {
        debugLog("❌ Telegram.WebApp mavjud emas. Bu xabar agar sen brauzerda ochgan bo‘lsang chiqadi.", true);

        // Test uchun fake user
        setUser({
          id: 111111,
          first_name: "Test",
          username: "fakeuser",
        });
        debugLog("✅ Fake user yuklandi.");
      } else {
        const tg = window.Telegram.WebApp;
        tg.ready();

        debugLog("✅ Telegram WebApp obyekt topildi.");

        const userData = tg.initDataUnsafe?.user;
        if (userData) {
          setUser(userData);
          debugLog("✅ Telegram foydalanuvchi ma'lumotlari olindi.");
        } else {
          debugLog("⚠️ Telegram foydalanuvchi ma'lumotlari yo‘q.", true);
        }
      }
    } catch (err) {
      debugLog("❌ Xatolik: " + err.message, true);
    }
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Telegram Mini App</h1>

      <h3>👤 User Data:</h3>
      <pre>{user ? JSON.stringify(user, null, 2) : "Ma'lumot yo'q"}</pre>

      <h3>🪲 Debug Logs:</h3>
      <div style={{ background: "#f9f9f9", border: "1px solid #ccc", padding: "10px" }}>
        {logs.map((log, i) => (
          <p key={i} style={{ color: log.isError ? "red" : "black" }}>
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
