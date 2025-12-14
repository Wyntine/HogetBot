FROM node:25-alpine
WORKDIR /usr/src/hoget
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]