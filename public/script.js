const socket = io();
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Función para agregar mensajes al chat
function appendMessage(user, message) {
  const messageDiv = document.createElement("div");
  const textDiv = document.createElement("div");
  messageDiv.className =
    user === "Usuario" ? "flex items-start" : "flex items-start justify-end";
  textDiv.className =
    user === "Usuario"
      ? "px-4 py-2 rounded-lg inline-block rounded-bl-none bg-blue-600 text-white"
      : "px-4 py-2 rounded-lg inline-block rounded-br-none bg-green-600 text-white";
  textDiv.textContent = message;
  messageDiv.appendChild(textDiv);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Desplazar hacia abajo para ver el último mensaje
}

// Escuchar mensajes del servidor
socket.on("message", (data) => {
  appendMessage(data.user, data.message);
});

// Enviar mensajes al servidor
function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    appendMessage("Usuario", message); // Agregar mensaje del usuario al chat
    socket.emit("message", { message: message });
    messageInput.value = "";
  }
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    sendMessage();
    event.preventDefault(); // Evita el comportamiento predeterminado de Enter (nueva línea)
  }
});
