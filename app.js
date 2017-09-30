import Express from 'express';
import bodyParser from 'body-parser';
import Router from 'named-routes';
import methodOverride from 'method-override';
import socketIO from 'socket.io';
import path from 'path';

export default (port) => {
  const app = Express();
  const router = new Router();
  router.extendExpress(app);
  router.registerAppHelpers(app);
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));

  const pathToStatic = path.join(__dirname, 'public');
  app.use('/assets', Express.static(pathToStatic));

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
