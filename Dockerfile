FROM node:latest
WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8836

CMD [ "npm", "run", "dev" ]
