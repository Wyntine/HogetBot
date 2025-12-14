FROM node:25-alpine
WORKDIR /usr/src/hoget
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]