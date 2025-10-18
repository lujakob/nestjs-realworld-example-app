const axios = require("axios");

async function createTestUsers() {
  try {
    // Створюємо user1
    console.log("Creating user1...");
    const user1Response = await axios.post("http://localhost:3000/api/users", {
      user: {
        username: "user1",
        email: "user1@example.com",
        password: "password123",
      },
    });
    console.log("User1 created:", user1Response.data);

    // Створюємо user2
    console.log("Creating user2...");
    const user2Response = await axios.post("http://localhost:3000/api/users", {
      user: {
        username: "user2",
        email: "user2@example.com",
        password: "password123",
      },
    });
    console.log("User2 created:", user2Response.data);
  } catch (error) {
    console.error(
      "Error creating users:",
      error.response?.data || error.message
    );
  }
}

createTestUsers();
