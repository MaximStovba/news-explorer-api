// middlewares/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  // JWT в localStorage
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация!' });
  }

  if (authorization && !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация!' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация!' });
  }

  // записываем пейлоуд в объект запроса
  req.user = payload;

  next(); // пропускаем запрос дальше

  return null;
};

module.exports = {
  auth,
};
