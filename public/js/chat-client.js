window.onload = () => {
  const socket = io();
  const textarea = document.getElementById('message-field');
  const sendButton = document.getElementById('send-message');
  const messagesArea = document.getElementById('content');
  const listOfUsers = document.getElementById('online-users');
  const blockOfTyping = document.getElementById('info-of-activity');


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
    setTimeout(() => {
      if (msg) {
        msg.remove();
      }
    }, 800);
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
    const blockOfMsg = document.createElement('div');
    blockOfMsg.setAttribute('class', 'block-of-msg');
    messagesArea.appendChild(blockOfMsg);
    const message = document.createElement('p');
    blockOfMsg.appendChild(message);
    message.setAttribute('class', 'message');
    message.innerHTML = msg;
    const sender = document.createElement('p');
    sender.setAttribute('class', 'sender');
    sender.innerHTML = nickname;
    blockOfMsg.appendChild(sender);
  };

  sendButton.onclick = () => {
    const text = textarea.value;
    createMessage(text, 'You');
    socket.emit('message', text);
    textarea.value = '';
  };

  socket.on('incoming message', ({ msg, sender }) => {
    createMessage(msg, sender);
  });

  socket.on('delete offline user', (offUser) => {
    const report = document.createElement('p');
    report.setAttribute('class', 'user');
    report.innerHTML = `${offUser.nickname} disconnected`;
    messagesArea.appendChild(report);
    setTimeout(() => report.remove(), 5000);
    const liUser = listOfUsers.getElementsByTagName('li');
    const users = Array.prototype.slice.call(liUser);
    const offlineUser = users.find(user => user.innerHTML === offUser.nickname);
    offlineUser.remove();
  });
};
