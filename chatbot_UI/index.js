const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  if (inputField.value == "") {
    inputField.placeholder = "You need to Type a Message here";
    inputField.focus();
  } else {
    const message = inputField.value;
    inputField.value = "";
    chatBoxBody.innerHTML += `<div class="message"><span>${message}</span></div>`;
    chatBoxBody.innerHTML += `<div id="loading" class="response loading">.</div>`;
    scrollToBottom();
    window.dotsGoingUp = true;
    var dots = window.setInterval(function () {
      var wait = document.getElementById("loading");
      if (window.dotsGoingUp) wait.innerHTML += ".";
      else {
        wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
        if (wait.innerHTML.length < 2) window.dotsGoingUp = true;
      }
      if (wait.innerHTML.length > 3) window.dotsGoingUp = false;
    }, 250);
    inputField.placeholder = "Ask a question...";
    async function myData(message) {
      try {
        const response = await fetch("http://localhost:3000/message", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        document.getElementById("loading").remove();
        let str = data.replaceAll("*", "*&nbsp;").replaceAll("\n", "<br>");
        chatBoxBody.innerHTML += `<div class="response"><p>${str}</p></div>`;
        scrollToBottom();
        console.log(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
    myData(message);
  }
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}
