window.onload = () => {
  const socket = io();
  const textarea = document.getElementById('message-field');
  const sendButton = document.getElementById('send-message');
  const messagesArea = document.getElementById('content');
  const timerDelta = 400;
  // const divNicknameField = document.getElementById('nickname-field');

  socket.on('greeting message', (data) => {
    const greetingMessage = document.createElement('p');
    greetingMessage.setAttribute('class', 'greeting-message');
    greetingMessage.innerHTML = data.message;
    messagesArea.appendChild(greetingMessage);
  });

  textarea.onkeypress = () => {
    socket.emit('start typing', { message: 'typing...' });
  };

  // textarea.onkeydown = () => {
  //   socket.emit('typing message', { message: 'typing...' });
  // };
  textarea.onkeyup = () => {
    socket.emit('stop typing');
  };

  socket.on('typing message', (data) => {
    if (!document.getElementById('typing-message')) {
      const typingMsg = document.createElement('p');
      typingMsg.setAttribute('id', 'typing-message');
      typingMsg.innerHTML = data.message;
      messagesArea.appendChild(typingMsg);
    }
  });
  socket.on('stop typing', () => {
    const typingMsg = document.getElementById('typing-message');
    setTimeout(() => {
      if (typingMsg) {
        typingMsg.remove();
      }
    }, 400);
  });
};
  // sendButton.onclick = () => {
  //
  //   } else {
  //     const text = textarea.value;
  //     socket.emit('message', { message: text });
  //   }
  // };