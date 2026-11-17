

const sendButton = document.querySelector("button");
const input = document.querySeleNova-ai
Repository navigation
Code
Issues
Pull requests
3
 (3)
You’re making changes in a project you don’t have write access to. Submitting a change will write it to a new branch in your fork rubykings656-cmd/Nova-ai, so you can send a pull request.
Nova-ai
/
Scritpt.js
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing Scritpt.js file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17


const sendButton = document.querySelector("button");
const input = document.querySelector("input");

function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  alert("NOVA AI: Hello! I received your message: " + message);

  input.value = "";
}

sendButton.addEventListener("click", sendMessage);

Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
ctor("input");

function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  alert("NOVA AI: Hello! I received your message: " + message);

  input.value = "";
}

sendButton.addEventListener("click", sendMessage);
