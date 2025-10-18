const axios = require("axios");

async function testBlockedUsers() {
  try {
    // Спочатку потрібно залогінитися і отримати токен
    const loginResponse = await axios.post(
      "http://localhost:3000/api/users/login",
      {
        user: {
          email: "user1@example.com", // використовуємо дані з тестів
          password: "password123",
        },
      }
    );

    const token = loginResponse.data.user.token;
    console.log("Token received:", token);

    // Спочатку заблокуємо користувача user2
    console.log("Blocking user2...");
    const blockResponse = await axios.post(
      "http://localhost:3000/api/profiles/user2/block",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Block response:", JSON.stringify(blockResponse.data, null, 2));

    // Тепер тестуємо ендпоінт заблокованих користувачів
    console.log("Getting blocked users...");
    const blockedResponse = await axios.get(
      "http://localhost:3000/api/profiles/blocked",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Blocked users response:",
      JSON.stringify(blockedResponse.data, null, 2)
    );
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testBlockedUsers();
