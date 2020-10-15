// models/article.js
const mongoose = require('mongoose');
const NotFoundError = require('../errors/not-found-err'); // 404
const ForbiddenError = require('../errors/forbidden-err'); // 403

const articleSchema = new mongoose.Schema({
  // Ключевое слово, по которому ищутся статьи. Обязательное поле-строка.
  keyword: {
    type: String,
    required: true,
  },
  // Заголовок статьи. Обязательное поле-строка.
  title: {
    type: String,
    required: true,
  },
  // Текст статьи. Обязательное поле-строка.
  text: {
    type: String,
    required: true,
  },
  // Дата статьи. Обязательное поле-строка.
  date: {
    type: String,
    required: true,
  },
  // Источник статьи. Обязательное поле-строка.
  source: {
    type: String,
    required: true,
  },
  // Cсылка на статью. Обязательное поле-строка. Должно быть URL-адресом.
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  // Cсылка на иллюстрацию к статье. Обязательное поле-строка. Должно быть URL-адресом.
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  // _id пользователя, сохранившего статью.
  // Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

// добавим метод deleteArticleOfUser схеме пользователя
// у него будет параметры — идентификатор пользователя и идентификатор статьи
articleSchema.statics.deleteArticleOfUser = function deleteArticle(owner, articleId) {
  return this.findById(articleId).select('+owner')
    .orFail(new NotFoundError('Нет статьи с таким id!'))
    .then((articleInf) => {
      if (String(articleInf.owner) === owner) {
        return this.findByIdAndRemove(articleId)
          .then((article) => article); // данные удаленой статьи доступны
      }
      // При попытке удалить чужую статью выбрасываем исключение
      throw new ForbiddenError('Отсутствуют права на удаление данной статьи!');
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('article', articleSchema);
