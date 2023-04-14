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


let user = ""

if (!user==="") {
  Swal.fire({
    title: "Log In",
    input: "text",
    text: "User Name",
    allowOutsideClick: false,
    color: '#716add',
    inputValidator: (value) => {
      return !value && "You have to write your name";
    },
  }).then((newUser) => {
    user = newUser.value;
    ename.innerText = user;
    socket.emit("newUser", user);
  });
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  const messageText = message.value.trim();
  message.value = "";
  console.log("Client: ", messageText);
  socket.emit("message", { user, message: messageText, date: new Date().toLocaleTimeString() });
  socket.emit("user",{user})
});

socket.on("message", (data) => {
  console.log("Message received: ", data);
  newMessages.push(data);
  imprimirMessages(newMessages);
});

function imprimirMessages(newMessages) {
  let _newMessages = "";
  for (const message of newMessages) {
    _newMessages += `${message.user}: ${message.message} - ${message.date}\n`;
  }
  messages.innerText = _newMessages;
}

socket.on("newUser", (nombre) => {
  Swal.fire({
    text: `New user ${nombre} conected!`,
    toast: true,
    position: "top-right",
  });
});