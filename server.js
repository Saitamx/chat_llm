const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

// Configuración de Axios para LLM
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "OpenAI-Beta": "assistants=v1",
  },
  maxBodyLength: Infinity,
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("message", async ({ message, categoryCode }) => {
    try {
      // Enviar mensaje al LLM y obtener respuesta
      const response = await axiosInstance.post(
        "https://quer-assistant--saitamx1.repl.co/newMessage",
        { thread_id: "thread_BxYTAKAE4hiU8Q5ZKy18QmuM", categoryCode, message }
      );

      // Emitir la respuesta del LLM al cliente
      const llmResponse = response.data.messages.data[0].content[0].text.value;
      io.emit("message", {
        user: "LLM",
        message: llmResponse,
        categoryCode: response.data.categoryCode,
      });
    } catch (error) {
      console.error("Error comunicándose con LLM:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});