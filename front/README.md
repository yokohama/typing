## 環境構築

### クローン
```
$ git clone xxx
$ cd typing/front
```
### .env.localファイル
以下の内容で、`.env.local` を作成してください。
```
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_ENDPOINT_URL=http://localhost:3000
```

### 起動
```
$ npm install
$ npm run dev
```
