# USING THE MULTIPART BUILD

# BUIL PART
FROM node:22.22.2 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

#PRODUCTION PART
FROM node:22.22.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/server.js"]