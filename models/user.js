// models/user.js
const mongoose = require('mongoose');
const emailValidator = require('validator');

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
  // Почта пользователя, по которой он регистрируется. Это обязательное поле, уникальное для каждого пользователя.
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

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);