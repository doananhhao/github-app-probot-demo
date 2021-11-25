## Setup

```sh
# Install dependencies
npm install

# Build bundle
npm run build

# Run the bot
npm start
```

## Docker

```sh
# 1. Build bundle
npm install && npm run build

# 2. Build container
docker build -t probot-ilaam .

# 3. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> probot-ilaam
OR
docker compose up
```
