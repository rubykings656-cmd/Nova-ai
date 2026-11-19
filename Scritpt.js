
const sendButton = document.querySelector("button");
const input = document.querySelector("input");

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

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("NOVA returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Server error: " + response.status
      );
    }

    const reply = data.reply;

    if (!reply) {
      throw new Error("NOVA did not return a reply.");
    }

    alert("NOVA AI: " + reply);
    input.value = "";

  } catch (error) {
    alert("NOVA AI Error: " + error.message);
    console.error("NOVA AI error:", error);

  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
  }
}

sendButton.addEventListener("click", sendMessage);
