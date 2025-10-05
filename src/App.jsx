import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isTelegram, setIsTelegram] = useState(false);

  const debugLog = (message, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, isError, timestamp }]);
    
    // Console ga ham yozish
    if (isError) {
      console.error(`[${timestamp}] ${message}`);
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  };

  // Telegram muhitini tekshirish
  const checkTelegramEnvironment = () => {
    debugLog("🔍 Telegram muhiti tekshirilmoqda...");
    
    if (typeof window === 'undefined') {
      debugLog("❌ Window obyekti mavjud emas", true);
      return false;
    }
    
    if (typeof window.Telegram === "undefined") {
      debugLog("❌ Telegram obyekti mavjud emas", true);
      return false;
    }
    
    if (!window.Telegram.WebApp) {
      debugLog("❌ Telegram.WebApp mavjud emas", true);
      return false;
    }
    
    debugLog("✅ Telegram.WebApp mavjud");
    return true;
  };

  // Telegram WebApp ni ishga tushirish
  const initializeTelegramApp = () => {
    try {
      const tg = window.Telegram.WebApp;
      
      // WebApp ni ishga tushirish
      tg.ready();
      debugLog("✅ Telegram WebApp ishga tushirildi");
      
      // Asosiy parametrlarni olish
      debugLog(`📱 Platforma: ${tg.platform}`);
      debugLog(`🌐 Color scheme: ${tg.colorScheme}`);
      debugLog(`📏 Viewport height: ${tg.viewportHeight}`);
      debugLog(`🔄 Init Data: ${tg.initData ? "Mavjud" : "Mavjud emas"}`);
      
      // Foydalanuvchi ma'lumotlarini olish
      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
        debugLog("✅ Foydalanuvchi ma'lumotlari muvaffaqiyatli yuklandi");
        debugLog(`   👤 Foydalanuvchi ID: ${userData.id}`);
        debugLog(`   📛 Ism: ${userData.first_name}`);
        debugLog(`   🆔 Username: ${userData.username || "Mavjud emas"}`);
      } else {
        debugLog("⚠️ Foydalanuvchi ma'lumotlari topilmadi", true);
        
        // Qo'shimcha tekshirish
        if (tg.initData) {
          debugLog("ℹ️ InitData mavjud, lekin user ma'lumotlari yo'q");
        } else {
          debugLog("❌ InitData ham mavjud emas", true);
        }
      }
      
      // WebApp ni kengaytirish
      tg.expand();
      debugLog("✅ WebApp kengaytirildi");
      
      return true;
    } catch (error) {
      debugLog(`❌ Telegram WebApp ishga tushirishda xatolik: ${error.message}`, true);
      return false;
    }
  };

  useEffect(() => {
    debugLog("🚀 Mini App yuklandi");
    
    // Telegram muhitini tekshirish
    const isTg = checkTelegramEnvironment();
    setIsTelegram(isTg);
    
    if (isTg) {
      // Telegram WebApp ni ishga tushirish
      const initSuccess = initializeTelegramApp();
      
      if (!initSuccess) {
        debugLog("⚠️ Telegram WebApp ishga tushirish muvaffaqiyatsiz, test rejimiga o'tilmoqda", true);
        loadTestData();
      }
    } else {
      debugLog("ℹ️ Telegram muhitida emas, test rejimiga o'tilmoqda");
      loadTestData();
    }
  }, []);

  // Test ma'lumotlarini yuklash
  const loadTestData = () => {
    setTimeout(() => {
      const testUser = {
        id: 123456789,
        first_name: "Test Foydalanuvchi",
        username: "test_user",
        language_code: "uz",
        is_premium: false
      };
      
      setUser(testUser);
      debugLog("✅ Test ma'lumotlari yuklandi");
    }, 1000);
  };

  // Loglarni tozalash
  const clearLogs = () => {
    setLogs([]);
    debugLog("🧹 Loglar tozalandi");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Telegram Mini App</h1>
        <div className={`status ${isTelegram ? 'status-telegram' : 'status-test'}`}>
          {isTelegram ? "🔵 Telegram muhitida" : "🟡 Test rejimida"}
        </div>
      </header>

      <div className="content">
        <section className="user-section">
          <h2>👤 Foydalanuvchi Ma'lumotlari</h2>
          <div className="user-card">
            {user ? (
              <div>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Ism:</strong> {user.first_name}</p>
                <p><strong>Username:</strong> @{user.username || "Mavjud emas"}</p>
                <p><strong>Til:</strong> {user.language_code || "Aniqlanmadi"}</p>
                <details className="raw-data">
                  <summary>Batafsil ma'lumot</summary>
                  <pre>{JSON.stringify(user, null, 2)}</pre>
                </details>
              </div>
            ) : (
              <p>Ma'lumotlar yuklanmoqda...</p>
            )}
          </div>
        </section>

        <section className="debug-section">
          <div className="debug-header">
            <h2>🪲 Debug Loglari</h2>
            <button onClick={clearLogs} className="clear-btn">
              Tozalash
            </button>
          </div>
          
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">Hozircha loglar mavjud emas</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`log-item ${log.isError ? 'error' : 'info'}`}>
                  <span className="timestamp">[{log.timestamp}]</span>
                  <span className="message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;