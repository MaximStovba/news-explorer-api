// routes/articles.js

const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const {
  getUsersArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

// возвращает все сохранённые пользователем статьи
// GET /articles
router.get('/', getUsersArticles);

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
// POST /articles
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/),
    image: Joi.string().required().pattern(/^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/),
  }),
}), createArticle);

// удаляет сохранённую статью  по _id
// DELETE /articles/:articleId
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;
