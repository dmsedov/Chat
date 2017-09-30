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
    console.log('hi');
    greetingMessage.innerHTML = data.message;
    messagesArea.appendChild(greetingMessage);
  });
  sendButton.onclick = () => {
    if (nickname.value === '') {
      const alertMessage = document.createElement('p');
      alertMessage.innerHTML = 'Nickname field must be filled';
      divNicknameField.appendChild(alertMessage);
    } else {
      const text = textarea.value;
      socket.emit('message', { message: text });
    }
  };
};
