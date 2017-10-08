export default class User {
  constructor(nickname, password) {
    this.nickname = nickname;
    this.password = password;
  }
  isGuest() {
    return false;
  }
  addSocketId(id) {
    this.socketId = id;
    return id;
  }
}
