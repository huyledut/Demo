const meRouter = require('./me');
const authRouter = require('./auth');
const homeRouter = require('./home');
const joinRouter = require('./meet');
const auth_middleware = require('../app/middleware/Auth_middleware');
function route(app) {
    app.use('/me', auth_middleware.requireLogin, meRouter);
    app.use('/auth', authRouter);
    app.use('/home', auth_middleware.requireHome, homeRouter);
    app.use('/meet', auth_middleware.requireLogin, joinRouter);
    app.use('/', auth_middleware.requireHome, homeRouter);
}
module.exports = route;

