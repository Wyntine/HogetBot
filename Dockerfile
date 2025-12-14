FROM node:25-alpine
WORKDIR /usr/src/hoget
COPY package*.json ./
RUN npm i
COPY . .
RUN chown -R node:node /usr/src/hoget
USER node
CMD ["npm", "start"]