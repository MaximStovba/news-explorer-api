// controllers/users.js

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

// POST /users (временное решение - создание пользователя)
function createUser(req, res, next) {
  const { name, password, email } = req.body;
  
  User.create({ name, password, email })
    // вернём записанные в базу данные
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getMe,
  createUser,
};