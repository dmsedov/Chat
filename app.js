import Express from 'express';
import bodyParser from 'body-parser';
import Router from 'named-routes';
import methodOverride from 'method-override';
import socketIO from 'socket.io';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import encrypt from './src/encrypt';
import User from './entities/User';
import Guest from './entities/Guest';
import NotFoundError from './entities/NotFoundPage';
import Message from './entities/Message';

export default (port) => {
  const app = Express();
  const router = new Router();
  router.extendExpress(app);
  router.registerAppHelpers(app);
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use(cookieParser());
  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  }));

  const pathToStatic = path.join(__dirname, 'public');
  const users = [new User('Admin1', encrypt('blabla'))];
  const onlineUsers = [];
  const messages = [];

  app.use('/assets', Express.static(pathToStatic));
  app.use((req, res, next) => {
    if (req.session.nickname) {
      const identUser = users.find(user => user.nickname === req.session.nickname);
      app.locals.currentUser = identUser;
      onlineUsers.push(identUser);
      app.locals.foreignUsers = onlineUsers.filter(user => user.nickname !== req.session.nickname);
      app.locals.onlineUsers = onlineUsers;
      app.locals.messages = messages;
    } else {
      app.locals.currentUser = new Guest();
    }
    next();
  });
  app.get('/', 'root', (req, res) => {
    res.render('index');
  });

  app.post('/users', 'users', (req, res) => {
    const { nickname, password } = req.body;
    const error = {};
    const foundUser = users.find(user => user.nickname === nickname);
    if (!foundUser) {
      const newUser = new User(nickname, encrypt(password));
      req.session.nickname = nickname;
      users.push(newUser);
      res.redirect('/');
    } else {
      error.nickname = 'must be unique';
      res.status(422);
      res.render('index', { error });
    }
  });

  app.post('/session', 'session', (req, res) => {
    const { nickname, password } = req.body;
    const error = {};
    const foundUser = users.find(user => user.nickname === nickname
      && user.password === encrypt(password));
    if (foundUser) {
      req.session.nickname = nickname;
      res.redirect('/');
    } else {
      res.status = 422;
      error.message = 'Invalid nickname or password';
      res.render('index', { error });
    }
  });

  app.delete('/session', 'session', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(404);
      res.render('errorPages/404');
    } else {
      res.status(500);
      res.render('errorPages/500');
    }
  });

  const io = socketIO.listen(app.listen(port));
  io.on('connection', (socket) => {
    console.log('connected successfully');
    const id = app.locals.currentUser.addSocketId(socket.id);
    const currentOnlineUser = app.locals.onlineUsers.find(user => user.socketId === id);
    socket.broadcast.emit('user connected', currentOnlineUser);
    console.log(currentOnlineUser, 'current user');
    socket.on('start typing', (data) => {
      const report = currentOnlineUser.nickname + data.message;
      socket.broadcast.emit('typing message', { report, currentOnlineUser });
    });
    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', currentOnlineUser);
    });
    socket.on('message', (msg) => {
      const sender = currentOnlineUser.nickname;
      const newMessage = new Message(sender, msg);
      messages.push(newMessage);
      socket.broadcast.emit('incoming message', { msg, sender });
    });

    socket.on('disconnect', () => {
      const offUser = onlineUsers.find(user => user.socketId === socket.id);
      socket.broadcast.emit('delete offline user', offUser);
      console.log(`${offUser.nickname} user disconnected`);
    });
  });
};
