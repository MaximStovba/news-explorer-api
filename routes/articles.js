// routes/articles.js

const express = require('express');

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
router.post('/', createArticle);

// удаляет сохранённую статью  по _id
// DELETE /articles/:articleId
router.delete('/:articleId', deleteArticle);

module.exports = router;
