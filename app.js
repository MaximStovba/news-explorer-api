require('dotenv').config(); // env-переменные из файла добавятся в process.env
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const {
  userRouter,
  articleRouter,
} = require('./routes');

const {
  login,
  createUser,
} = require('./controllers/users');

const { auth } = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------------
// подключаемся к серверу mongo
// -------------------------------
mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  console.log('connection to database established');
}).catch((err) => {
  console.log(`db error ${err.message}`);
});

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '5f8738ceaa434f447e15fb73',
  };

  next();
});

// --------------------------------
// роуты не требующие авторизации
// --------------------------------
app.post('/signup', celebrate({ // POST /signup — создаёт пользователя
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({ // POST /signin — аутентификация пользователя
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// мидлвер авторизации пользователя
app.use(auth);

// -------------------------------
// роуты, требующие авторизации
// -------------------------------
app.use('/users/', userRouter); // user router
app.use('/articles/', articleRouter); // article router

// -------------------------------
// ловим -= 404 =-
// -------------------------------
app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

// -------------------------------
// обработчик ошибок celebrate
// -------------------------------
app.use(errors());

// -------------------------------
// централизовано обрабатываем все ошибки
// -------------------------------
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
