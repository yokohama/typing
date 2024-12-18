# typing-backend (Rails)

## 環境構築
```
$ gitクローン
$ cd typing/backend_rails
```

### ビルド＆DB作成
```
$ docker compose build
$ docker compose run --rm api rails db:create
$ docker compose run --rm api rails db:migrate
$ docker compose run --rm api rails db:seed
```

## 起動
```
$ docker compose up
```
