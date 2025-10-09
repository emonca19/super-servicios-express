FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN NODE_ENV=development npm install

COPY prisma ./prisma/

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]