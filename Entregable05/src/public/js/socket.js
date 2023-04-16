const socket = io();
let ename = document.getElementById("ename");
let submit = document.getElementById("submit");
let message = document.getElementById("message");
let messages = document.getElementById("messages");

let newMessages = [];
socket.on("Welcome", (arg) => {
  console.log(arg);
  newMessages = arg.messages;
  console.log(newMessages);
  imprimirMessages(newMessages);
});


let userEmail = null

if (!userEmail) {
  Swal.fire({
    title: "Log In",
    input: "text",
    text: "User eMail",
    allowOutsideClick: false,
    color: '#716add',
    inputValidator: (value) => {
      return !value && "You have to write your eMail";
    },
  }).then((newUser) => {
    userEmail = newUser.value;
    ename.innerText = userEmail;
    socket.emit("newUser", userEmail);
  });
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  const messageText = message.value.trim();
  message.value = "";
  console.log("Client: ", messageText);
  socket.emit("message", { userEmail, message: messageText, date: new Date().toLocaleTimeString() });
  socket.emit("user",{userEmail})
});

socket.on("message", (data) => {
  console.log("Message received: ", data);
  newMessages.push(data);
  printMessages(newMessages);
});

function printMessages(newMessages) {
  let _newMessages = "";
  for (const message of newMessages) {
    _newMessages += `${message.userEmail}: ${message.message} - ${message.date}\n`;
  }
  messages.innerText = _newMessages;
}

socket.on("newUser", (_name) => {
  Swal.fire({
    text: `New user ${_name} conected!`,
    toast: true,
    position: "top-right",
  });
});