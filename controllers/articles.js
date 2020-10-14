// controllers/articles.js

// импортируем модель
const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err'); // 400
const ForbiddenError = require('../errors/forbidden-err'); // 403
const NotFoundError = require('../errors/not-found-err'); // 404

// возвращает все сохранённые пользователем статьи
// GET /articles
function getUsersArticles(req, res, next) {
  const owner = req.user._id;

  Article.find({ owner })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
}

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
// POST /articles
function createArticle(req, res, next) {
  const owner = req.user._id;
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    // вернём записанные в базу данные
    .then((article) => res.status(200).send({ data: article }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new BadRequestError('Ошибка валидации!');
        return next(e);
      }
      return next(err);
    });
}

// удаляет сохранённую статью  по _id
// DELETE /articles/:articleId
function deleteArticle(req, res, next) {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('Нет статьи с таким id!'))
    .then((articleInf) => {
      if (String(articleInf.owner) === req.user._id) {
        return Article.findByIdAndRemove(req.params.articleId)
          .then((article) => res.status(200).send({ data: article }))
          .catch(next);
      }
      // При попытке удалить чужую карточку выбрасываем исключение
      throw new ForbiddenError('Отсутствуют права на удаление данной статьи!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new BadRequestError('C запросом что-то не так!');
        return next(e);
      }
      return next(err);
    });
}

module.exports = {
  getUsersArticles,
  createArticle,
  deleteArticle,
};
