# STAGE 1: BUILD STAGE
FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./

RUN npm install --omit=dev

COPY app/ .


# STAGE 2: PRODUCTION STAGE
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

USER node

CMD ["node", "server.js"]
