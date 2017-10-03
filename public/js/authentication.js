const divCenter = document.getElementsByClassName('center')[0];
const authForm = document.getElementById('auth-form');
const nickname = document.getElementById('nickname');
const password = document.getElementById('password');
const signInButton = document.getElementById('sign-in');


const isValidData = (str, regExp) => {
  const result = regExp.test(str);
  return result;
};

const regExpOfNickname = /^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$/;
const regExpOfPassword = /^[a-zA-Z0-9]{6,12}$/;

nickname.onfocus = () => {
  const el = document.getElementsByClassName('notification')[0];
  if (el) {
    divCenter.removeChild(el);
  }
};


password.onfocus = () => {
  const el = document.getElementsByClassName('notification')[0];
  if (el) {
    divCenter.removeChild(el);
  }
};


authForm.onsubmit = () => {
  const el = document.getElementsByClassName('notification')[0];
  const nick = nickname.value;
  const key = password.value;
  const cond = isValidData(nick, regExpOfNickname) && isValidData(key, regExpOfPassword);
  if (!cond) {
    if (!el) {
      const note = document.createElement('p');
      note.innerHTML = 'Fields nickname and password must be correct or full filled!';
      note.className = 'notification';
      divCenter.insertBefore(note, signInButton);
    }
    return false;
  }
  return true;
};
