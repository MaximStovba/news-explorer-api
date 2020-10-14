const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {
  userRouter,
  // articleRouter
} = require('./routes');

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
    _id: '5f86e6a5fb66f13240e8cd3a',
  };

  next();
});

// -------------------------------
// роуты
// -------------------------------
app.use('/users/', userRouter); // user router
// app.use('/articles/', articleRouter); // article router

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
