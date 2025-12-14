FROM node:25-alpine
WORKDIR /usr/src/hoget
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]