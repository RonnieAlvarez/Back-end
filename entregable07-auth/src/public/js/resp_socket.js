const socket = io();
let ename = document.getElementById("ename");
let submit = document.getElementById("submit");
let message = document.getElementById("message");
let messages = document.getElementById("messages");

/* This code is listening for a "Welcome" event emitted by the server using Socket.io. When the event
is received, it logs the argument passed to the event to the console, assigns the value of the
`messages` property of the argument to the `newMessages` variable, logs the `newMessages` array to
the console, and calls the `imprimirMessages` function to update the messages displayed on the
client's page. The `newMessages` array contains all the messages that have been sent in the chatroom
up to this point. */
let newMessages = [];
socket.on("Welcome", (arg) => {
  console.log(arg);
  newMessages = arg.messages;
  console.log(newMessages);
  imprimirMessages(newMessages);
});

/* This code is prompting the user to enter their name if the `user` variable is null or undefined. It
uses the SweetAlert2 library to display a modal with an input field for the user to enter their
name. If the user submits the form with an empty input field, an error message is displayed. Once
the user enters their name and submits the form, the `newUser` event is emitted to the server with
the user's name, and the user's name is displayed on the client's page. */
let user = null
if (!user) {
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

/* This code is adding an event listener to the "submit" button. When the button is clicked, it
prevents the default behavior of submitting a form, gets the value of the "message" input field,
clears the input field, logs the message to the console, emits a "message" event to the server with
the user's name, message text, and the current time, and also emits a "user" event to the server
with the user's name. */
submit.addEventListener("click", (e) => {
  e.preventDefault();
  const messageText = message.value.trim();
  message.value = "";
  console.log("Client: ", messageText);
  socket.emit("message", { user, message: messageText, date: new Date().toLocaleTimeString() });
  socket.emit("user",{user})
});

/* This code is listening for a "message" event emitted by the server using Socket.io. When the event
is received, it logs the message data to the console, pushes the message data to the `newMessages`
array, and calls the `imprimirMessages` function to update the messages displayed on the client's
page. */
socket.on("message", (data) => {
  console.log("Message received: ", data);
  newMessages.push(data);
  imprimirMessages(newMessages);
});

/**
 * The function takes an array of messages and formats them into a string to be displayed on a webpage.
 * @param newMessages - The parameter `newMessages` is an array of objects containing information about
 * messages. Each object has the following properties: `user` (string), `message` (string), and `date`
 * (string).
 */
function imprimirMessages(newMessages) {
  let _newMessages = "";
  for (const message of newMessages) {
    _newMessages += `${message.user}: ${message.message} - ${message.date}\n`;
  }
  messages.innerText = _newMessages;
}

/* This code is listening for a "newUser" event emitted by the server using Socket.io. When the event
is received, it displays a toast notification using the SweetAlert2 library to inform the client
that a new user has connected to the chat. The notification includes the name of the new user. */
socket.on("newUser", (nombre) => {
  Swal.fire({
    text: `New user ${nombre} conected!`,
    toast: true,
    position: "top-right",
  });
});