// routes/users.js

const express = require('express');

const router = express.Router();

const { getMe } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
// GET /users/me
router.get('/me', getMe);

// POST /users (временное решение - создание пользователя)
// router.post('/', createUser);

module.exports = router;
