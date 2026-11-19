

const sendButton = document.getElementById("sendButton");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

async function sendMessage() {
  const message = input.value.trim();

  if (!message) {
    alert("Please enter a message first.");
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  try {
    const response = await fetch(
      "https://nova-ai.rubykings656.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server error: " + response.status);
    }

    if (!data.reply) {
      throw new Error("NOVA did not return a reply.");
    }

    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + message;
    messages.appendChild(userMessage);

    const novaMessage = document.createElement("p");
    novaMessage.textContent = "NOVA AI: " + data.reply;
    messages.appendChild(novaMessage);

    input.value = "";

  } catch (error) {
    alert("NOVA AI Error: " + error.message);
    console.error(error);

  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
  }
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
