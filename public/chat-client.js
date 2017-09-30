window.onload = () => {
  const socket = io();
  const messages = [];
  const nickname = document.getElementById('nickname');
  const textarea = document.getElementById('field');
  const sendButton = document.getElementById('send');
  const messagesArea = document.getElementById('content');
  const divNicknameField = document.getElementById('nickname-field');

  socket.on('greeting message', (data) => {
    const greetingMessage = document.createElement('p');
    greetingMessage.setAttribute('class', 'greeting-message');
    greetingMessage.innerHTML = data.message;
    messagesArea.appendChild(greetingMessage);
  });

  nickname.onfocus = () => {
    const elements = document.getElementsByClassName('alert-message');
    if (elements.length !== 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };
  sendButton.onclick = () => {
    const elements = document.getElementsByClassName('alert-message');
    console.log(elements, 'elements');
    if (nickname.value === '') {
      const message = 'Nickname field must be filled!'
      if (elements.length === 0) {
        const alertMessage = document.createElement('p');
        alertMessage.innerHTML = message;
        alertMessage.setAttribute('class', 'alert-message');
        divNicknameField.appendChild(alertMessage);
      }
    } else {
      const text = textarea.value;
      socket.emit('message', { message: text });
    }
  };
};
