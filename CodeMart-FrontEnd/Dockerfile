FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm install --legacy-peer-deps class-variance-authority && npm run dev"]
