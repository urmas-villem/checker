# Build Stage
FROM node:18.18.2-alpine as builder
WORKDIR /work/
COPY ./src/package*.json ./
RUN npm install --production
COPY ./src/ .

# Final Stage
FROM node:18.18.2-alpine
WORKDIR /app
COPY --from=builder /work/ .
RUN apk add --no-cache curl jq
CMD ["node", "server.js"]