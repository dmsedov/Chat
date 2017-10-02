const divCenter = document.getElementsByClassName('center')[0];
const nickname = document.getElementById('nickname');
const password = document.getElementById('password');
const signInButton = document.getElementById('sign-in');
const signUpButton = document.getElementById('sign-up');


const isValidData = (str, regExp) => {
  const result = regExp.test(str);
  return result;
};


nickname.onfocus = () => {
  const el = document.getElementsByClassName('notification')[0];
  if (el) {
    divCenter.removeChild(el);
    signInButton.removeAttribute('disabled');
    signUpButton.removeAttribute('disabled');
  }
};

nickname.onblur = () => {
  const str = nickname.value;
  let note;
  const regExp = /^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$/;
  const el = document.getElementsByClassName('notification')[0];
  if (str.length !== 0 && !isValidData(str, regExp)) {
    if (!el) {
      note = document.createElement('p');
      note.innerHTML = 'Invalid nickname';
      note.className = 'notification';
      divCenter.insertBefore(note, signInButton);
      signInButton.setAttribute('disabled', 'disabled');
      signUpButton.setAttribute('disabled', 'disabled');
    }
  }
};

password.onfocus = () => {
  const el = document.getElementsByClassName('notification')[0];
  if (el) {
    divCenter.removeChild(el);
    signInButton.removeAttribute('disabled');
    signUpButton.removeAttribute('disabled');
  }
};

password.onblur = () => {
  const str = password.value;
  const el = document.getElementsByClassName('notification')[0];
  let note;
  const regExp = /^[a-zA-Z0-9]{6,12}$/;
  if (str.length !== 0 && !isValidData(str, regExp)) {
    if (!el) {
      note = document.createElement('p');
      note.innerHTML = 'Invalid password';
      note.className = 'notification';
      divCenter.insertBefore(note, signInButton);
      signInButton.setAttribute('disabled', 'disabled');
      signUpButton.setAttribute('disabled', 'disabled');
    }
  }
};

  sendButton.onclick = () => {
    const elements = document.getElementsByClassName('alert-message');
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
