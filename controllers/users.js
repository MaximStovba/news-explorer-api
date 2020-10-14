// controllers/users.js

const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err'); // 404

// возвращает информацию о пользователе (email и имя)
// GET /users/me
function getMe(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id!'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'C запросом что-то не так!' });
      }
      return next(err);
    });
}

// POST /signin — аутентификация пользователя
function login(req, res, next) {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => { // аутентификация успешна!
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через неделю
      );

      // вернём токен (JWT в localStorage)
      res.send({ token });
    })
    .catch(next);
}

// POST /signup — создаёт пользователя
function createUser(req, res, next) {
  const SALT_NUM = 10;
  const {
    name,
    email,
    password,
  } = req.body;
  // хешируем пароль
  return User.createUserByCredentials(name, email, password, SALT_NUM)
    // вернём записанные в базу данные
    .then((user) => res.status(200).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      // console.log(err.message);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return next(err);
    });
}

module.exports = {
  getMe,
  login,
  createUser,
};
