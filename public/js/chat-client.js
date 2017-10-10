window.onload = () => {
  const socket = io();
  const textarea = document.getElementById('message-field');
  const sendButton = document.getElementById('send-message');
  const messagesArea = document.getElementById('content');
  const listOfUsers = document.getElementById('online-users');
  const blockOfTyping = document.getElementById('info-of-activity');


  socket.on('greeting message', (data) => {
    const greetingMessage = document.createElement('p');
    greetingMessage.setAttribute('class', 'greeting-message');
    greetingMessage.innerHTML = data.message;
    messagesArea.appendChild(greetingMessage);
  });

  textarea.onkeypress = () => {
    socket.emit('start typing', { message: ' is typing...' });
  };

  textarea.onkeyup = () => {
    socket.emit('stop typing');
  };

  socket.on('typing message', (data) => {
    const id = data.currentOnlineUser.socketId;
    if (!document.getElementById(`${id}`)) {
      const typingMsg = document.createElement('p');
      typingMsg.setAttribute('id', `${id}`);
      typingMsg.innerHTML = data.report;
      blockOfTyping.appendChild(typingMsg);
    }
  });
  socket.on('stop typing', (user) => {
    const msg = document.getElementById(`${user.socketId}`);
    // setTimeout(() => {
    //   if (msg) {
    //     msg.remove();
    //   }
    // }, 800);
  });

  socket.on('user connected', (user) => {
    const report = document.createElement('p');
    report.setAttribute('class', 'new-User');
    report.innerHTML = `${user.nickname} connected`;
    messagesArea.appendChild(report);
    const listItem = document.createElement('li');
    listItem.innerHTML = user.nickname;
    listOfUsers.appendChild(listItem);
    setTimeout(() => report.remove(), 5000);
  });

  const createMessage = (msg, nickname) => {
    const message = document.createElement('p');
    message.setAttribute('class', 'message');
    message.innerHTML = msg;
    messagesArea.appendChild(message);
    const sender = document.createElement('span');
    sender.innerHTML = nickname;
    message.appendChild(sender);
  };

  sendButton.onclick = () => {
    const text = textarea.value;
    createMessage(text, 'You');
    socket.emit('message', text);
  };
  socket.on('incoming message', ({ msg, sender }) => {
    console.log(msg, sender, '!!!');
    createMessage(msg, sender);
  });
};
