import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    // Telegram WebApp API orqali userni olish
    const tg = window.Telegram.WebApp;

    if (tg.initDataUnsafe?.user) {
      setTelegramUser(tg.initDataUnsafe.user);
    } else {
      console.warn("Telegram user ma'lumotlari topilmadi!");
    }
  }, []);

  useEffect(() => {
    if (!telegramUser) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crm.api.blago-vsem.uz/projects/by-phone/?user_id=${telegramUser.id}`
        );
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [telegramUser]);

  if (!telegramUser) {
    return <h2 style={{ textAlign: "center" }}>Telegram orqali oching ❗</h2>;
  }

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Yuklanmoqda...</h2>;
  }

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Ma'lumot topilmadi!</h2>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Foydalanuvchi loyihalari</h1>
      <p>
        <strong>User ID:</strong> {telegramUser.id}
      </p>
      <p>
        <strong>Ism:</strong> {telegramUser.first_name}{" "}
        {telegramUser.last_name || ""}
      </p>
      <p>
        <strong>Telegram:</strong> @{telegramUser.username}
      </p>
      <hr />

      <h2>Loyihalar ro'yxati:</h2>
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
              <strong>Manzil:</strong> {project.address}
            </p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <p>
              <strong>Qo‘shimcha telefonlar:</strong>{" "}
              {project.phones.join(", ")}
            </p>
            <p>
              <strong>Yaratilgan sana:</strong>{" "}
              {new Date(project.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Tasdiqlanganmi:</strong>{" "}
              {project.isApproved ? "✅ Ha" : "❌ Yo‘q"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
