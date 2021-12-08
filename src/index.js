const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3002;
const route = require('./routes/index.js');
const room = require('./app/models/Room');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const db = require('./config/db');
const peerServer = ExpressPeerServer(server, { debug: true });
const io = new Server(server);
const socketController = require('./app/controllers/Socket_Controller');
const hbs_Helper = require('./app/controllers/Hbs_Helper');
app.use(express.urlencoded({ extended: true })); //nhan du lieu tu form
app.use(express.json()); //gui tu code js thi nhan tu thang json
app.engine('hbs', handlebars({ extname: 'hbs', helpers: hbs_Helper.helpers }));
app.use(cookieParser('Hello World'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));
app.use(methodOverride('_method'));
app.use('/peer', peerServer);
db.connect();
room.findOne({ ClassName: '19TCLCDT4' }).then(function (room) {});
route(app);
socketController.start(io);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
