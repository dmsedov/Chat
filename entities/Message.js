export default class Message {
  static id = 1;
  constructor(owner, content) {
    this.id = Message.id++;
    this.owner = owner;
    this.content = content;
  }
}
