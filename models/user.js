// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const emailValidator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const ConflictError = require('../errors/conflict-err'); // 409

const userSchema = new mongoose.Schema({
  // Имя пользователя, например: Александр или Мария.
  // Это обязательное поле-строка от 2 до 30 символов.
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // Хеш пароля. Обязательное поле-строка.
  // Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле.
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  // Почта пользователя, по которой он регистрируется.
  // Это обязательное поле, уникальное для каждого пользователя.
  // Также оно должно валидироваться на соответствие схеме электронной почты.
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return emailValidator.isEmail(v);
      },
      message: (props) => `Attention, ${props.value} is not a valid email!`,
    },
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль!'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль!'));
          }

          return user; // user доступен
        });
    });
};

// метод создания нового пользователя
userSchema.statics.createUserByCredentials = function createUser(
  name, email, password, SALT_NUM,
) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new ConflictError('Пользователь с таким email уже зарегистрирован!'));
      }
      // хешируем пароль
      return bcrypt.hash(password, SALT_NUM)
        .then((hash) => {
          if (!hash) {
            return Promise.reject(new Error('Ошибка хеширования!'));
          }
          // создаем юзера в базе
          return this.create({
            name,
            email,
            password: hash, // записываем хеш в базу
          }).then((u) => {
            if (!u) {
              return Promise.reject(new Error('Ошибка записи данных!'));
            }
            // ищем юзера и возвращаем данные без password
            return this.findOne({ email });
          });
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
