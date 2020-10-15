// controllers/articles.js

// импортируем модель
const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err'); // 400

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
    .then((article) => {
      Article.findById(article._id)
        .then((articleInf) => {
          res.status(200).send({ data: articleInf });
        })
        .catch(next);
    })
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
  Article.deleteArticleOfUser(req.user._id, req.params.articleId)
    // вернём записанные в базу данные
    .then((articleInf) => {
      res.status(200).send({ data: articleInf });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('C запросом что-то не так!'));
      }
      return next(err);
    });
}

module.exports = {
  getUsersArticles,
  createArticle,
  deleteArticle,
};
