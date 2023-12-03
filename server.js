const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const functions = require("./functions");
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

let assistantId;

// Crear un asistente LLM al iniciar el servidor
functions.createAssistant(axiosInstance).then((id) => {
  assistantId = id;
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("message", async (data) => {
    try {
      // Enviar mensaje al LLM y obtener respuesta
      const response = await axiosInstance.post("http://localhost:8080/chat", {
        thread_id: "thread_qRoL4FOR0mgdupnMs1MDvq7b",
        message: data.message,
      });

      // Emitir la respuesta del LLM al cliente
      const llmResponse = response.data.messages.data[0].content[0].text.value;
      io.emit("message", {
        user: "LLM",
        message: llmResponse,
        color: response.data.color,
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
