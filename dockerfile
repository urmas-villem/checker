# Build Stage
FROM node:18.18.2-alpine as builder
WORKDIR /work/
COPY ./src/package*.json /work/
RUN npm install --production  # Only install production dependencies
COPY ./src/ /work/

# Final Stage
FROM node:18.18.2-alpine
WORKDIR /app
COPY --from=builder /work/ /app/
RUN apk add --no-cache curl jq
CMD ["node", "server.js"]