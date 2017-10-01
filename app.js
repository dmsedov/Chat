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
  const users = [new User('Admin', encrypt('blabla'))];
  app.use('/assets', Express.static(pathToStatic));

  app.use((req, res, next) => {
    if (req.session && req.session.nickname) {
      const identUser = users.find(user => user.nickname === req.session.nickname);
      app.locals.currentUser = identUser;
    } else {
      app.locals.currentUser = new Guest();
    }
    next();
  });
  app.get('/', 'root', (req, res) => {
    res.render('index');
  });
  const io = socketIO.listen(app.listen(port));
  io.on('connection', (socket) => {
    console.log('connected successfully');
    socket.emit('greeting message', { message: 'Welcome to chat!' });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
