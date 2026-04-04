# TRYING MULTI_STAGE BUILDS

#BUILD PART
FROM node:22.22.2 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 5173

RUN npm run build

#PRODUCTION PART
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

