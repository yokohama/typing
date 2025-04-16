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
RUST_BACKTRACE=1
JWT_SECRET=secret
PROFILE=yokohama
CLOUDWATCH_LOG_GROUP=/aws/apprunner/xxxxxx
ALLOWED_ORIGINS=http://localhost:3001
```

### 必要な開発環境ツールのインストール(migrationで必要)
```
# Rustまわり
TODO: ここにCargoのインストール
$ cargo install cargo-watch
$ cargo install sqlx-cli --no-default-features --features postgres

# posgreクライアント
$ apt-get update
$ apt-get install -y postgresql-client
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
