

const sendButton = document.querySelector("button");
const input = document.querySelector("input");

async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  try {
    const response = await fetch(
      "https://nova.arubykings656.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      }
    );

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();

    alert("NOVA AI: " + (data.reply || data.message || "No response received."));
    input.value = "";

  } catch (error) {
    alert("NOVA AI connection error. Please try again.");
    console.error(error);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
  }
}

sendButton.addEventListener("click", sendMessage);
