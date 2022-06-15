# news-explorer-api

API of the News Explorer project, which includes authorization and registration of users, operations with articles and users.

### Heroku deploy

* [https://news-explorer-api.herokuapp.com](https://news-explorer-api.herokuapp.com)

## API description

### Articles
- `GET /articles` - returns all articles saved by the user
- `POST /articles` - creates an article (passed parameters: keyword, title, text, date, source, link и image)
- `DELETE /articles/:articleId` - deletes the stored article by id

### Users
- `GET /users/me` - returns information about the user (email и имя)
- `POST /signin` - user authentication
- `POST /signup` - creates a user

## Docker установка
- `docker-compose build` — билд docker-контейнера
- `docker-compose up` — запуск docker-контейнера
- `docker-compose stop` — остановка docker-контейнера
- `docker-compose rm` — удаление docker-контейнера
