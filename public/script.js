const socket = io();
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Función para agregar mensajes al chat
function appendMessage(user, message, color = null) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.textContent = `${user.toUpperCase()}: ${message}`;

  if (color) {
    const colorSection = document
      .getElementById(color)
      .querySelector(".messages");
    colorSection.appendChild(messageDiv);
    colorSection.scrollTop = colorSection.scrollHeight;
  } else {
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Escuchar mensajes del servidor
socket.on("message", (data) => {
  appendMessage(data.user, data.message, data.color);
});

// Enviar mensajes al servidor
function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    appendMessage("Usuario", message);
    socket.emit("message", { message: message });
    messageInput.value = "";
  }
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    sendMessage();
    event.preventDefault();
  }
});
