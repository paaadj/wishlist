FROM node:18

COPY public ./public
COPY src ./src
COPY package.json ./
COPY tsconfig.json ./

RUN npm install -g npm
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]