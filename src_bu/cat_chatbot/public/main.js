console.log("Hello, front end!");

async function sendMessage() {
  // Retrieve the value from the text input
  const userPrompt = document.getElementById("prompt").value;
  if (!userPrompt.trim()) return;
  appendMessage(userPrompt, "user");

  // Construct the URL with the prompt as a query parameter
  const url = `/api/nonsense?prompt=${encodeURIComponent(userPrompt)}`;

  // Fetch the response from the backend and display it
  const response = await fetch(url);
  const responseText = await response.text();

  // Display the bot's response in the chat history
  appendMessage(responseText, "bot");

  // Clear the input field after sending the message
  document.getElementById("prompt").value = "";
}

function appendMessage(message, sender) {
  const chatHistory = document.getElementById("chat-history");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (sender === "user") {
    messageDiv.classList.add("user-message");
  } else {
    messageDiv.classList.add("bot-message"); // Ensure you have styles for bot-message
  }

  messageDiv.textContent = message;
  chatHistory.appendChild(messageDiv);

  // Scroll to the bottom of the chat history to show the newest message
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

document.getElementById("generate").addEventListener("click", sendMessage);
