import React, { useEffect, useState } from "react";

// Debug component – xatolik va loglarni ekranda ko‘rsatadi
function Debug({ title, log }) {
  return (
    <div style={{ background: "#111", color: "#0f0", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
      <h4>{title}</h4>
      <pre>{JSON.stringify(log, null, 2)}</pre>
    </div>
  );
}

function App() {
  const [telegramUser, setTelegramUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Telegramdan userni olish
  useEffect(() => {
    try {
      const tg = window.Telegram ? window.Telegram.WebApp : null;

      if (tg?.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user);
      } else {
        console.warn("Telegram user ma'lumotlari topilmadi, mock ishlatyapman.");
        // Mock user (browserda test qilish uchun)
        setTelegramUser({
          id: "5130310327",
          first_name: "Test",
          last_name: "User",
          username: "testuser",
        });
      }
    } catch (err) {
      setError("Telegram WebApp aniqlanmadi!");
    }
  }, []);

  // API’dan ma’lumot olish
  useEffect(() => {
    if (!telegramUser) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crm.api.blago-vsem.uz/projects/by-phone/?user_id=${telegramUser.id}`
        );
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [telegramUser]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>⏳ Yuklanmoqda...</h2>;
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        <h2>Xatolik yuz berdi!</h2>
        <p>{error}</p>
        <Debug title="Telegram User" log={telegramUser} />
        <Debug title="API Javobi" log={data} />
      </div>
    );
  }

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>❌ Ma'lumot topilmadi!</h2>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>📋 Foydalanuvchi loyihalari</h1>

      <p>
        <strong>👤 User ID:</strong> {telegramUser.id}
      </p>
      <p>
        <strong>👤 Ism:</strong> {telegramUser.first_name}{" "}
        {telegramUser.last_name || ""}
      </p>
      <p>
        <strong>🔗 Telegram:</strong> @{telegramUser.username}
      </p>
      <hr />

      <h2>📂 Loyihalar:</h2>
      {data.projects.length === 0 ? (
        <p>Hozircha loyiha mavjud emas.</p>
      ) : (
        data.projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              background: "#f9f9f9",
            }}
          >
            <h3>{project.object_name}</h3>
            <p>
              <strong>📍 Manzil:</strong> {project.address}
            </p>
            <p>
              <strong>📌 Status:</strong> {project.status}
            </p>
            <p>
              <strong>📞 Telefonlar:</strong> {project.phones.join(", ")}
            </p>
            <p>
              <strong>📅 Sana:</strong>{" "}
              {new Date(project.created_at).toLocaleString()}
            </p>
            <p>
              <strong>✅ Tasdiqlanganmi:</strong>{" "}
              {project.isApproved ? "Ha ✅" : "Yo‘q ❌"}
            </p>
          </div>
        ))
      )}

      {/* Debug ma'lumotlarni chiqarish */}
      <Debug title="Telegram User" log={telegramUser} />
      <Debug title="API Javobi" log={data} />
    </div>
  );
}

export default App;
