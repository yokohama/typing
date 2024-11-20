# typing-backend

## 環境構築
```
$ gitクローン
$ cd typing/backend
```

### .evnファイル
以下の内容で `typing/backend/.env` を作成してください。
```
APP_NAME=typing
```

### ビルド＆DB作成
```
$ docker compose build
$ docker compose up # DBが無いよエラーが出るので、Ctrl+Cでdockerを停止
$ make create-db # DB作成
```

## 起動
```
$ cd typing/backend
$ docker compose up
```
